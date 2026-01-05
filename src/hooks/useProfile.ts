import { useEffect, useState, useCallback } from "react";
import { ProfileSchema, type Profile } from "../schema/profile";
import { TemplateSchema, type Template } from "../schema/template";

export function useProfiles(profileId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Initial load */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rawProfile = localStorage.getItem(`my-ideals:profile:${profileId}`);
        if (!rawProfile) {
          throw new Error("Profile not found in localStorage");
        }

        console.log("rawProfile:", rawProfile);

        const parsedProfile = ProfileSchema.parse(
          JSON.parse(rawProfile)
        );

        if (cancelled) return;
        setProfile(parsedProfile);

        /* ---- Load template (via link in profile) ---- */
        const res = await fetch(parsedProfile.templateLink);
        if (!res.ok) {
          throw new Error(`Failed to load template: ${res.status}`);
        }

        const templateJson = await res.json();
        const parsedTemplate = TemplateSchema.parse(templateJson);

        if (cancelled) return;
        setTemplate(parsedTemplate);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Unknown error"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Update profile helper */
  const updateProfile = useCallback(
    (updater: (prev: Profile) => Profile) => {
      setProfile(prev => {
        if (!prev) return prev;

        const next = updater(prev);

        // Validate before saving
        ProfileSchema.parse(next);

        localStorage.setItem(`my-ideals:profile:${profileId}`, JSON.stringify(next));
        console.log("Saved profile:", next);

        return next;
      });
    },
    []
  );

  return {
    profile,
    template,
    isLoading,
    error,
    updateProfile,
  };
}
