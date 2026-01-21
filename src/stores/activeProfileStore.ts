import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { debounce } from 'lodash-es';
import { type Profile } from '@/domain/profile';
import { TemplateSchema, type Template } from '@/domain/template';
import { ProfileStorage } from '@/storage/profileStorage';
import { useProfileListStore } from './profileListStore';
import { debugLog } from '@/utils/debug';
import {
  diffProfileWithTemplate,
  syncProfileWithTemplate,
  type ProfileTemplateDiff,
} from '@/utils/syncProfile';

export type LoadError =
  | null
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

        set(state => {
          state.profile = null;
          state.template = null;
          state.changes = null;
          state.pendingSync = false;
          state.isLoading = true;
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

        let res: Response;
        try {
          res = await fetch(profile.template.link);
        } catch (e) {
          setError('template', `${e instanceof Error ? e.message : 'Network error'}`, profile);
          return;
        }

        if (!res.ok) {
          setError('template', `HTTP ${res.status}: ${res.statusText}`, profile);
          return;
        }

        const data = await res.json();
        const result = TemplateSchema.safeParse(data);

        if (!result.success) {
          const errors = result.error.issues
            .map(i => `${i.path.join('.')}: ${i.message}`)
            .join('\n');
          setError('template', `Invalid template:\n${errors}`, profile);
          return;
        }

        const template = result.data;
        if (template.id !== profile.template.id) {
          return;
        }

        let changes: ProfileTemplateDiff | null = null;
        let pendingSync = false;
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

        set(state => {
          state.profile = profile;
          state.template = template;
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

          if (!state.profile.collections[collectionId]) {
            state.profile.collections[collectionId] = {};
          }

          const current = state.profile.collections[collectionId][itemId] ?? false;
          state.profile.collections[collectionId][itemId] = !current;
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
