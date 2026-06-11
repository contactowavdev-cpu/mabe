import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)
  const forwardedProto = context.request.headers.get('x-forwarded-proto')
  const host = context.request.headers.get('x-forwarded-host') || context.request.headers.get('host') || url.host
  const canonicalHost = host === 'www.wavdev.lat' ? 'wavdev.lat' : host
  const shouldUseHttps = forwardedProto === 'http' || (url.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(url.hostname))
  const needsSlash = !url.pathname.endsWith('/') && !url.pathname.includes('.') && !url.pathname.startsWith('/api/')

  if (shouldUseHttps || canonicalHost !== host || needsSlash) {
    url.protocol = shouldUseHttps ? 'https:' : url.protocol
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
