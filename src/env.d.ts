/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_MEASUREMENT_ID?: string
  readonly RESEND_API_KEY?: string
  readonly CONTACT_TO_EMAIL?: string
  readonly CONTACT_FROM_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
