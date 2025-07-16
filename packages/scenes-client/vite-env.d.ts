/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST_URL: string
  readonly VITE_ISSUER_URL: string
  readonly VITE_OIDC_SCOPES: string
  readonly VITE_CLIENT_ID: string
  readonly VITE_CLIENT_SECRET: string
  readonly VITE_ITWIN_ID: string
  readonly VITE_IMODEL_ID: string
  readonly VITE_SCENE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
