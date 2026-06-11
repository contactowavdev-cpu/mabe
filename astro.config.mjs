import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://wavdev.lat',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  trailingSlash: 'always',
  compressHTML: true,
  security: {
    checkOrigin: true,
  },
})
