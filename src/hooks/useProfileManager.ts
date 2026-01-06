// hooks/useProfileManager.ts
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { nanoid } from 'nanoid';
import { ProfileStorage, type ProfileIndex, type ProfileEntry } from '@/storage/localStorage';
import { type Profile } from '@/domain/profile';

export function useProfileManager() {
  const [index, setIndex] = useImmer<ProfileIndex>(ProfileStorage.getProfileIndex());

  useEffect(() => ProfileStorage.setProfileIndex(index), [index]);
  // TODO: validate profile index data on startup

  const setActiveProfile = useCallback(
    (profileId: string) => {
      setIndex(draft => {
        draft.active = profileId;
      });
    },
    [setIndex]
  );

  const deleteProfile = useCallback(
    (profileId: string) => {
      ProfileStorage.deleteProfile(profileId);

      const newProfiles = index.profiles.filter(p => p.id !== profileId);
      const newActiveId = index.active === profileId ? (newProfiles[0]?.id ?? null) : index.active;
      setIndex(draft => {
        draft.active = newActiveId;
        draft.profiles = newProfiles;
      });
    },
    [index, setIndex]
  );

  const renameProfile = useCallback(
    (profileId: string, newName: string) => {
      const profile = ProfileStorage.getProfile(profileId);
      if (!profile) {
        console.error(`renameProfile: Profile ${profileId} not found`);
        return;
      }

      ProfileStorage.setProfile({ ...profile, name: newName });
      setIndex(draft => ({
        ...draft,
        profiles: draft.profiles.map(p => (p.id === profileId ? { ...p, name: newName } : p)),
      }));
    },
    [setIndex]
  );

  const importProfile = useCallback(
    (profile: Profile, overwrite: boolean = false) => {
      const existingIndex = index.profiles.findIndex(p => p.id === profile.id);
      const finalProfile =
        existingIndex >= 0 && !overwrite ? { ...profile, id: nanoid() } : profile;

      ProfileStorage.setProfile(finalProfile);

      setIndex(draft => {
        if (existingIndex >= 0 && overwrite) {
          draft.profiles.splice(existingIndex, 1);
        }
        draft.profiles.push({ id: finalProfile.id, name: finalProfile.name });
        draft.active = finalProfile.id;
      });
    },
    [index.profiles, setIndex]
  );

  const activeProfile: ProfileEntry | null =
    index.profiles.find(p => p.id === index.active) || null;

  return {
    profiles: index.profiles,
    activeProfile,
    setActiveProfile,
    deleteProfile,
    renameProfile,
    importProfile,
  };
}
