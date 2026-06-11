export interface ContactPayload {
  name: string
  email: string
  phone: string
  service: string
  message: string
  consent: boolean
  company: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const allowedServices = new Set([
  'Desarrollo web',
  'Sistemas a la medida',
  'CRM para empresas',
  'Automatización de procesos',
  'Otro proyecto',
])

export function cleanText(value: unknown, maxLength: number) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, maxLength)
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export function validateContactPayload(input: unknown) {
  const raw = typeof input === 'object' && input !== null ? input as Record<string, unknown> : {}
  const data: ContactPayload = {
    name: cleanText(raw.name, 80),
    email: cleanText(raw.email, 120).toLowerCase(),
    phone: cleanText(raw.phone, 30),
    service: cleanText(raw.service, 80),
    message: cleanText(raw.message, 3000),
    consent: raw.consent === true,
    company: cleanText(raw.company, 120),
  }

  const errors: string[] = []
  if (data.name.length < 2) errors.push('Ingresa tu nombre.')
  if (!emailPattern.test(data.email)) errors.push('Ingresa un correo válido.')
  if (!allowedServices.has(data.service)) errors.push('Selecciona un servicio válido.')
  if (data.message.length < 20) errors.push('Cuéntanos un poco más sobre el proyecto.')
  if (!data.consent) errors.push('Debes aceptar el aviso de privacidad.')

  return { data, errors, isBot: data.company.length > 0 }
}
