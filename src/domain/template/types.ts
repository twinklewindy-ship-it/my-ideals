import { type TemplateResourceBaseUrl } from './imageBaseUrl';

export type TemplateLayout = {
  aspectRatio?: [number, number];
  columns?: [number, number];
};

export type TemplateCollectionItem = {
  id: string;
  member: string | string[];
  name: string;
  image?: string;
  rotated?: boolean;
};

export type TemplateCollection = {
  id: string;
  name: string;
  category?: string; // 确保这里有 category
  layout?: TemplateLayout;
  items: TemplateCollectionItem[];
};

export type TemplateMember = {
  id: string;
  name: string;
};

export type Template = {
  magic: 'my-ideals-template';
  version: 1;
  revision: number;
  id: string;
  name: string;
  description?: string;
  author?: string;
  link?: string;
  categories?: string[];
  // 修正：统一为 itemUrl 和 baseUrl
  imageResourceType: 'itemUrl' | 'baseUrl'; 
  imageBaseUrl?: TemplateResourceBaseUrl;
  layout?: TemplateLayout;
  members: TemplateMember[];
  collections: TemplateCollection[];
};
