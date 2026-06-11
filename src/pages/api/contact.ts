import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { escapeHtml, validateContactPayload } from '../../lib/contact'

export const prerender = false

const attempts = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter((timestamp) => now - timestamp < WINDOW_MS)
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > MAX_ATTEMPTS
}

function json(message: string, status: number) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json('Formato de solicitud no válido.', 415)
  }

  const ip = clientIp(request)
  if (isRateLimited(ip)) {
    return json('Has enviado varias solicitudes. Espera unos minutos e intenta nuevamente.', 429)
  }

  let input: unknown
  try {
    input = await request.json()
  } catch {
    return json('No pudimos leer la solicitud.', 400)
  }

  const { data, errors, isBot } = validateContactPayload(input)
  if (isBot) return json('Recibimos tu mensaje.', 200)
  if (errors.length) return json(errors[0], 400)

  const apiKey = import.meta.env.RESEND_API_KEY
  const to = import.meta.env.CONTACT_TO_EMAIL
  const from = import.meta.env.CONTACT_FROM_EMAIL
  if (!apiKey || !to || !from) {
    console.error('Contact form email environment variables are incomplete.')
    return json('El formulario no está disponible temporalmente. Escríbenos por WhatsApp.', 503)
  }

  const safe = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone || 'No proporcionado'),
    service: escapeHtml(data.service),
    message: escapeHtml(data.message).replaceAll('\n', '<br />'),
  }

  try {
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Nueva solicitud: ${data.service} — ${data.name}`,
      html: `
        <h1>Nueva solicitud desde wavdev.lat</h1>
        <p><strong>Nombre:</strong> ${safe.name}</p>
        <p><strong>Correo:</strong> ${safe.email}</p>
        <p><strong>Teléfono:</strong> ${safe.phone}</p>
        <p><strong>Servicio:</strong> ${safe.service}</p>
        <p><strong>Mensaje:</strong><br />${safe.message}</p>
      `,
    })
    if (result.error) throw new Error(result.error.message)
  } catch (error) {
    console.error('Resend contact form error:', error)
    return json('No pudimos enviar el mensaje. Intenta nuevamente o escríbenos por WhatsApp.', 502)
  }

  return json('Recibimos tu mensaje. Te contactaremos pronto.', 200)
}
