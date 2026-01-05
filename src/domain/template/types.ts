type TemplateMember = {
  id: string;
  name: string;
};

type TemplateCollection = {
  id: string;
  name: string;
  items: {
    member: string;
    title: string;
  }[];
};

export type Template = {
  magic: "my-ideals-template";
  version: 1;
  id: string;
  name: string;
  members: TemplateMember[];
  collections: TemplateCollection[];
};
