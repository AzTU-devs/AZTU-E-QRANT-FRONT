/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API, reachable from the visitor's browser. */
  readonly VITE_API_BASE_URL?: string;
}
