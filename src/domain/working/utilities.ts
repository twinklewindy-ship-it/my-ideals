import { type WorkingCollection, type WorkingProfile } from './types';
import { type Profile } from '@/domain/profile';
import { type Template } from '@/domain/template';

export function buildWorkingProfile(profile: Profile, template: Template): WorkingProfile {
  const { collections: profileCollections, ...profileMeta } = profile;
  const { collections: templateCollections, ...templateMeta } = template;

  // Ensure the revision sync only applies to working profile
  profileMeta.template = structuredClone(profile.template);

  const collections: WorkingCollection[] = templateCollections.map(tc => {
    const statusMap = profileCollections[tc.id] || {};

    return {
      id: tc.id,
      name: tc.name,
      items: tc.items.map(item => ({
        ...item,
        status: statusMap[item.id] ?? false,
      })),
    };
  });

  // Profile and template is synced (assigning initial value above)
  profileMeta.template.revision = templateMeta.revision;

  return {
    template: templateMeta,
    profile: profileMeta,
    collections,
  };
}

export function extractProfileFromWorking(working: WorkingProfile): Profile {
  const { collections: WorkingCollections, profile } = working;

  return {
    ...profile,
    collections: Object.fromEntries(
      WorkingCollections.map(collection => [
        collection.id,
        Object.fromEntries(collection.items.map(item => [item.id, item.status])),
      ])
    ),
  };
}
