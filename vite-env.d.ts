interface ImportMetaEnv {
  readonly VITE_DEBUG: string;
  readonly VITE_DEBUG_CATEGORIES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
