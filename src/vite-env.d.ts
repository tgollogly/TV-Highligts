/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OWNER_NAME?: string;
  readonly VITE_STATIC_ONLY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
