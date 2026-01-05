import { type WorkingProfile } from './types';
import { type Profile } from '../profile';
import { type Template } from '../template';

export function buildWorkingProfile(profile: Profile, template: Template): WorkingProfile {
  const { collections: profileCollections, ...profileMeta } = profile;
  const { collections: templateCollections, ...templateMeta } = template;
  const profileCollectionMap = new Map(profileCollections.map(c => [c.id, c]));

  return {
    template: templateMeta,
    profile: profileMeta,
    collections: templateCollections.map(tc => {
      const pc = profileCollectionMap.get(tc.id);

      return {
        id: tc.id,
        name: tc.name,
        items: tc.items.map((item, idx) => ({
          member: item.member,
          title: item.title,
          status: pc?.status[idx] ?? false,
        })),
      };
    }),
  };
}

export function extractProfileFromWorking(working: WorkingProfile): Profile {
  const { collections, profile } = working;

  return {
    ...profile,
    collections: collections.map(c => ({
      id: c.id,
      status: c.items.map(i => i.status),
    })),
  };
}
