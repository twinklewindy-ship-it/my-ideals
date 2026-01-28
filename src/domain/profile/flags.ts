import { type Profile } from './types';

export const ProfileFlags = {
  ENABLE_COUNT: 'enable-count',
} as const;

export type ProfileFlag = (typeof ProfileFlags)[keyof typeof ProfileFlags];

export const profileHasFlag = (profile: Profile, flag: ProfileFlag): boolean =>
  profile.flags?.includes(flag) ?? false;
