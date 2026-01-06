type ProfileCollection = {
  id: string;
  status: boolean[];
};

export type Profile = {
  magic: 'my-ideals-profile';
  version: 1;
  id: string;
  name: string;
  templateId: string;
  templateLink: string;
  collections: ProfileCollection[];
};
