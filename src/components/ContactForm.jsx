import { useState } from 'react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
  consent: false,
  company: '',
}

export default function ContactForm({ defaultService = '' }) {
  const [form, setForm] = useState({ ...initialForm, service: defaultService })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const update = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ state: 'loading', message: 'Enviando tu solicitud…' })

    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'No pudimos enviar el mensaje.')

      setStatus({ state: 'success', message: 'Recibimos tu mensaje. Te contactaremos pronto.' })
      setForm({ ...initialForm, service: defaultService })
      window.trackWavDevEvent?.('generate_lead', { method: 'contact_form', service: form.service })
    } catch (error) {
      setStatus({
        state: 'error',
        message: error instanceof Error ? error.message : 'Ocurrió un error. Intenta nuevamente o escríbenos por WhatsApp.',
      })
    }
  }

  return (
    <form onSubmit={submit} aria-describedby="form-status">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" value={form.name} onChange={update} autoComplete="name" minLength={2} maxLength={80} required />
        </div>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={form.email} onChange={update} autoComplete="email" maxLength={120} required />
        </div>
        <div className="field">
          <label htmlFor="phone">Teléfono (opcional)</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" maxLength={30} />
        </div>
        <div className="field">
          <label htmlFor="service">Servicio</label>
          <select id="service" name="service" value={form.service} onChange={update} required>
            <option value="">Selecciona una opción</option>
            <option>Desarrollo web</option>
            <option>Sistemas a la medida</option>
            <option>CRM para empresas</option>
            <option>Automatización de procesos</option>
            <option>Otro proyecto</option>
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="message">¿Qué necesitas resolver?</label>
          <textarea id="message" name="message" value={form.message} onChange={update} minLength={20} maxLength={3000} required />
        </div>
        <div className="field" style={{ position: 'absolute', left: '-10000px' }} aria-hidden="true">
          <label htmlFor="company">Empresa</label>
          <input id="company" name="company" value={form.company} onChange={update} tabIndex={-1} autoComplete="off" />
        </div>
        <label className="consent field-full">
          <input name="consent" type="checkbox" checked={form.consent} onChange={update} required />
          <span>Acepto que WavDev use estos datos para responder mi solicitud según el <a href="/privacidad/">aviso de privacidad</a>.</span>
        </label>
      </div>
      <button className="button button-primary" type="submit" disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Enviando…' : 'Enviar solicitud'}
      </button>
      <p id="form-status" className="form-status" data-state={status.state} role="status" aria-live="polite">{status.message}</p>
    </form>
  )
}
