import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)
  const host = context.request.headers.get('x-forwarded-host') || context.request.headers.get('host') || url.host
  const canonicalHost = host === 'www.wavdev.lat' ? 'wavdev.lat' : host
  const needsSlash = !url.pathname.endsWith('/') && !url.pathname.includes('.') && !url.pathname.startsWith('/api/')

  // Railway terminates TLS at its proxy, so internal HTTP healthchecks must not
  // be redirected to HTTPS by the application container.
  if (canonicalHost !== host || needsSlash) {
    url.host = canonicalHost
    if (needsSlash) url.pathname += '/'
    return context.redirect(url.toString(), 301)
  }

  const response = await next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')

  if (url.pathname.startsWith('/_astro/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  return response
})
