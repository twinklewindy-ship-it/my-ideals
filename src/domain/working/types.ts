import { type Profile } from '@/domain/profile';
import { type Template } from '@/domain/template';

export type WorkingCollection = {
  id: string;
  name: string;
  items: {
    id: string;
    member: string;
    title: string;
    status: boolean;
  }[];
};

export type WorkingProfile = {
  profile: Omit<Profile, 'collections'>;
  template: Omit<Template, 'collections'>;
  collections: WorkingCollection[];
};
