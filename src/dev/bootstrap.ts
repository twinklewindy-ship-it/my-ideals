import { type Profile } from '../schema/profile';

export async function bootstrapDevProfile() {
  // Only run in dev
  if (import.meta.env.MODE !== 'development') return;

  console.info('[dev] Bootstrapping sample profile');

  const sampleProfile: Profile = await fetch('/sample/profile.json').then(res => res.json());
  console.info('[dev] Sample profile id:', sampleProfile.id);

  if (localStorage.getItem(`my-ideals:profile:${sampleProfile.id}`)) {
    console.info('[dev] Sample profile already exists, skipping bootstrap');
    return;
  }

  // Adjust templateLink to be absolute URL
  sampleProfile.templateLink = `${window.location.origin}/${sampleProfile.templateLink}`;

  localStorage.setItem(`my-ideals:profile:${sampleProfile.id}`, JSON.stringify(sampleProfile));
}
