import { type Profile } from '../profile';
import { type Template } from '../template';

type WorkingCollection = {
  id: string;
  name: string;
  items: {
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
