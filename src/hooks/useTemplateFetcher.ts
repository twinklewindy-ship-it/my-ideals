import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { debounce } from 'lodash-es';
import { z, ZodError } from 'zod';
import { TemplateSchema, type Template } from '@/domain/template';

export type TemplateFetchState =
  | { status: 'idle' }
  | { status: 'invalid-url' }
  | { status: 'loading' }
  | { status: 'success'; template: Template }
  | { status: 'id-mismatch'; actualId: string }
  | { status: 'error'; message: string };

type TemplateFetcherOptions = {
  initialUrl?: string;
  templateId?: string;
  onSuccess?: (template: Template) => void;
};

export function useTemplateFetcher({
  initialUrl = '',
  templateId,
  onSuccess = () => {},
}: TemplateFetcherOptions) {
  const [url, setUrl] = useState(initialUrl);
  const [state, setState] = useState<TemplateFetchState>({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetchTemplate = useCallback(
    async (fetchUrl: string, signal: AbortSignal) => {
      setState({ status: 'loading' });

      try {
        const response = await fetch(fetchUrl, { signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const template = TemplateSchema.parse(data);

        if (templateId && template.id !== templateId) {
          setState({ status: 'id-mismatch', actualId: template.id });
          return;
        }

        setState({ status: 'success', template });
        onSuccessRef.current?.(template);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;

        let message = 'Failed to fetch template';
        if (e instanceof ZodError) {
          message = `Invalid template:\n${e.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n')}`;
        } else if (e instanceof Error) {
          message = e.message;
        }

        setState({ status: 'error', message });
      }
    },
    [templateId]
  );

  const debouncedFetch = useMemo(
    () =>
      debounce((fetchUrl: string) => {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;
        fetchTemplate(fetchUrl, controller.signal);
      }, 500),
    [fetchTemplate]
  );

  useEffect(() => {
    const trimmed = url.trim();

    if (!trimmed) {
      setState({ status: 'idle' });
      return;
    }

    const urlResult = z.url().safeParse(trimmed);
    if (!urlResult.success) {
      setState({ status: 'invalid-url' });
      return;
    }

    debouncedFetch(trimmed);

    return () => {
      debouncedFetch.cancel();
      abortControllerRef.current?.abort();
    };
  }, [url, debouncedFetch]);

  return {
    url,
    setUrl,
    state,
    template: state.status === 'success' ? state.template : null,
  };
}
