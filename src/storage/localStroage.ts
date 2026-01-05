import { ProfileSchema, type Profile } from '../schema/profile';

const STORAGE_PREFIX = 'my-ideals';

export function loadProfile(id: string): Profile | null {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}:profile:${id}`);
  if (!raw)
    return null;

  try {
    const json = JSON.parse(raw);
    const parsed = ProfileSchema.safeParse(json);

    if (!parsed.success) {
      console.warn(`Unable to parse profile: ${id}: ${parsed.error}`);
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}
