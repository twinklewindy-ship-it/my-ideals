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
  category?: string; // --- 分类字段 ---
  layout?: TemplateLayout;
  items: TemplateCollectionItem[];
};

export type TemplateMember = {
  id: string;
  name: string;
};

export type Template = {
  magic: 'my-ideals-template';
  version: number;
  revision: number;
  id: string;
  name: string;
  description?: string;
  author?: string;
  categories?: string[]; // --- 分类列表定义 ---
  layout?: TemplateLayout;
  imageResourceType: 'baseUrl' | 'itemUrl';
  imageBaseUrl?: {
    root: string;
    format?: string;
    fallback?: string;
  };
  members: TemplateMember[];
  collections: TemplateCollection[];
};
