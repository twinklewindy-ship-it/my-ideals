import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { debounce } from 'lodash-es';
import { ProfileFlags, profileHasFlag, type Profile } from '@/domain/profile';
import { type Template } from '@/domain/template';
import { ProfileStorage } from '@/storage/profileStorage';
import { useProfileListStore } from './profileListStore';
import { debugLog } from '@/utils/debug';
import {
  diffProfileWithTemplate,
  syncProfileWithTemplate,
  type ProfileTemplateDiff,
} from '@/utils/syncProfile';
import { fetchTemplate, formatTemplateError } from '@/utils/fetchTemplate';

export type LoadError =
  | { type: 'template'; message: string }
  | { type: 'profile'; message: string };

type activeProfileStore = {
  // State
  profile: Profile | null;
  template: Template | null;
  changes: ProfileTemplateDiff | null;
  pendingSync: boolean;
  isLoading: boolean;
  error: LoadError | null;

  // Actions
  load: (profileId: string) => Promise<void>;
  clear: () => void;
  flush: () => void;
  confirmSyncChanges: (cleanup: boolean) => void;
  toggleStatus: (collectionId: string, itemId: string) => void;
  setCount: (collectionId: string, itemId: string, value: number) => void;
  toggleMember: (member: string) => void;
  updateName: (name: string) => void;
  updateTemplateUrl: (url: string) => void;
};

export const useActiveProfileStore = create<activeProfileStore>()(
  immer((set, get) => {
    const debouncedSave = debounce(() => {
      const { profile } = get();
      if (!profile) return;

      ProfileStorage.setProfile(profile);
      debugLog.store.log(`Profile ${profile.id} saved`);
    }, 500);

    return {
      profile: null,
      template: null,
      changes: null,
      isLoading: false,
      pendingSync: false,
      error: null,

      load: async (profileId: string) => {
        debouncedSave.flush();

        // 1. 先重置状态，但如果我们要利用缓存，可以先不完全清空，或者立刻填充
        set(state => {
          state.profile = null;
          state.template = null;
          state.changes = null;
          state.pendingSync = false;
          state.isLoading = true; // 先设为加载中
          state.error = null;
        });

        const setError = (
          type: Exclude<LoadError, null>['type'],
          message: string,
          profile: Profile | null = null
        ) => {
          debugLog.store.log(`Failed to load ${type}: ${message}`);
          set(state => {
            state.error = { type, message: `${type}: ${message}` };
            state.profile = profile;
            state.isLoading = false;
          });
        };

        let profile = ProfileStorage.getProfile(profileId);
        if (!profile) {
          setError('profile', `Unable to load Profile ${profileId}`);
          return;
        }

        // --- 优化：优先读取本地缓存 ---
        const cachedTemplate = ProfileStorage.getTemplate(profile.template.id);
        if (cachedTemplate) {
          debugLog.store.log(`Loaded cached template ${cachedTemplate.id}`);
          // 如果有缓存，立刻显示出来！不用等网络！
          set(state => {
            state.profile = profile;
            state.template = cachedTemplate;
            state.isLoading = false; // 结束加载状态，用户立刻看到内容
          });
        }

        // 2. 后台静默加载：去网络拉取最新版
        const templateResult = await fetchTemplate(profile.template.link, profile.template.id);
        
        if (!templateResult.success) {
          // 如果网络失败了
          if (cachedTemplate) {
            // 如果既然有缓存，那就用缓存顶着，只记录日志，不报错给用户
            console.warn('Network failed, using cached template:', templateResult.error);
            return; 
          }
          // 没缓存又没网络，那只能报错了
          setError('template', formatTemplateError(templateResult.error), profile);
          return;
        }

        const template = templateResult.template;
        
        // --- 优化：保存到本地缓存 ---
        ProfileStorage.setTemplate(template);

        // 3. 检查更新逻辑（和之前一样）
        let changes: ProfileTemplateDiff | null = null;
        let pendingSync = false;
        
        // 注意：这里我们对比的是“网络上的最新版”和“你档案里记录的版本”
        if (profile.template.revision !== template.revision) {
          if (profile.template.revision !== 0) {
            changes = diffProfileWithTemplate(profile, template);
            pendingSync = changes.removed.length > 0;
          }
          if (!pendingSync) {
            profile = syncProfileWithTemplate(profile, template, false);
            ProfileStorage.setProfile(profile);
          }
        }

        // 4. 用最新数据更新界面
        set(state => {
          state.profile = profile;
          state.template = template; // 替换为最新的
          state.changes = changes;
          state.pendingSync = pendingSync;
          state.isLoading = false;
        });

        debugLog.store.log(`Loaded profile ${profile.name}, ${profileId}`);
      },

      clear: () => {
        debouncedSave.flush();

        set(state => {
          state.profile = null;
          state.template = null;
          state.changes = null;
          state.pendingSync = false;
          state.isLoading = false;
          state.error = null;
        });
      },

      flush: () => debouncedSave.flush(),

      confirmSyncChanges: (cleanup: boolean) => {
        const { profile, template, pendingSync } = get();

        if (!profile || !template) return;

        if (!pendingSync) {
          set(state => {
            state.changes = null;
          });
          return;
        }

        const synced = syncProfileWithTemplate(profile, template, cleanup);
        ProfileStorage.setProfile(synced);

        set(state => {
          state.profile = synced;
          state.changes = null;
          state.pendingSync = false;
        });
      },

      toggleStatus: (collectionId: string, itemId: string) => {
        set(state => {
          if (!state.profile) return;

          if (profileHasFlag(state.profile, ProfileFlags.ENABLE_COUNT)) return;

          if (!state.profile.collections[collectionId]) {
            state.profile.collections[collectionId] = {};
          }

          const current = state.profile.collections[collectionId][itemId] ?? false;
          state.profile.collections[collectionId][itemId] = !current;
        });

        debouncedSave();
      },

      setCount: (collectionId: string, itemId: string, value: number) => {
        set(state => {
          if (!Number.isInteger(value) || value < 0) return;

          if (!state.profile) return;

          if (!profileHasFlag(state.profile, ProfileFlags.ENABLE_COUNT)) return;

          if (!state.profile.collections[collectionId]) {
            state.profile.collections[collectionId] = {};
          }
          state.profile.collections[collectionId][itemId] = value;
        });

        debouncedSave();
      },

      toggleMember: (member: string) => {
        set(state => {
          if (!state.profile) return;

          const selectedMembers = state.profile.selectedMembers;
          if (selectedMembers.includes(member)) {
            state.profile.selectedMembers = selectedMembers.filter(m => m !== member);
          } else {
            state.profile.selectedMembers = [...selectedMembers, member];
          }
        });
        debouncedSave();
      },

      updateName: (name: string) => {
        set(state => {
          if (state.profile) {
            state.profile.name = name;
          }
        });
        debouncedSave();
      },

      updateTemplateUrl: (url: string) => {
        set(state => {
          if (state.profile) {
            state.profile.template.link = url;
            debugLog.store.log(`Profile ${state.profile.id} template link updated to ${url}`);
          }
        });
        debouncedSave();
      },
    };
  })
);

useProfileListStore.subscribe(
  state => state.activeId,
  activeId => {
    if (activeId) {
      useActiveProfileStore.getState().load(activeId);
    } else {
      useActiveProfileStore.getState().clear();
    }
  },
  { fireImmediately: true }
);
