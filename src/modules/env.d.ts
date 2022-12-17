/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_S3_HOST: string
    readonly VITE_GTM_ID: string
    readonly VITE_AD_CLIENT_ID: string
    readonly VITE_AD_SLOT_1: string

    // viteデフォルトのmeta情報
    readonly BASE_URL: string
    readonly MODE: string
    readonly PROD: boolean
    readonly DEV: boolean
    readonly SSR: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
