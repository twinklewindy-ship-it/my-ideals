import { type Profile } from '@/domain/profile';
import { type Template } from '@/domain/template';

export type ItemChange = {
  id: string;
  name?: string;
};

export type CollectionChange = {
  id: string;
  name?: string;
  items: ItemChange[];
};

type Changes = {
  added: CollectionChange[];
  removed: CollectionChange[];
};

export type ProfileTemplateDiff = Changes;

export function diffProfileTemplate(_profile: Profile, _template: Template) {
  // TO
}
