import { type Profile, ProfileSchema } from '@/domain/profile';
import { type Template, TemplateSchema } from '@/domain/template'; // 2602新增导入
import { z } from 'zod';

const LOCAL_STORAGE_PREFIX = 'my-ideals';
const LOCAL_STORAGE_KEYS = {
  profile: (id: string = '') => `${LOCAL_STORAGE_PREFIX}:profile:${id}`,
  template: (id: string = '') => `${LOCAL_STORAGE_PREFIX}:template:${id}`, // 2602新增模板缓存Key
} as const;

function listProfiles(): string[] {
  const prefix = LOCAL_STORAGE_KEYS.profile();
  return Object.keys(localStorage)
    .filter(key => key.startsWith(prefix))
    .map(key => key.slice(prefix.length))
    .filter(id => z.nanoid().safeParse(id).success);
}

function getProfile(id: string): Profile | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.profile(id));
  if (!raw) {
    return null;
  }

  try {
    return ProfileSchema.parse(JSON.parse(raw));
  } catch (e) {
    console.error(`Unable to parse profile: ${id}:`, e);
    return null;
  }
}

function setProfile(profile: Profile): void {
  localStorage.setItem(LOCAL_STORAGE_KEYS.profile(profile.id), JSON.stringify(profile));
}

function deleteProfile(id: string): void {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.profile(id));
}

// --- 2602新增：获取缓存模板 ---
function getTemplate(id: string): Template | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.template(id));
  if (!raw) {
    return null;
  }
  try {
    return TemplateSchema.parse(JSON.parse(raw));
  } catch (e) {
    console.error(`Unable to parse cached template: ${id}`, e);
    return null;
  }
}

// --- 2602新增：保存缓存模板 ---
function setTemplate(template: Template): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.template(template.id), JSON.stringify(template));
  } catch (e) {
    // 如果缓存满了，防止崩坏
    console.warn('Failed to cache template (likely quota exceeded):', e);
  }
}

export const ProfileStorage = {
  listProfiles,
  getProfile,
  setProfile,
  deleteProfile,
  // 导出新功能
  getTemplate,
  setTemplate,
};
