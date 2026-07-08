import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Save, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'

type PdfOrderDraft = {
  orderNumber: string
  orderDate?: string
  customerName: string
  customerIdCard?: string
  postalCode?: string
  crossStreets?: string
  neighborhood?: string
  homePhone?: string
  cellPhone?: string
  officePhone?: string
  phoneExtension?: string
  assignedToType?: string
  purchasePlaceOrigin?: string
  technicianNumber?: string
  modelOrigin?: string
  moduleOrigin?: string
  serialNumberOrigin?: string
  baseOrigin?: string
  productDescriptionOrigin?: string
  confirmedPurchasePlace?: string
  confirmedInvoiceNumber?: string
  confirmedPurchaseDate?: string
  confirmedBrand?: string
  confirmedModel?: string
  confirmedSerialNumber?: string
  requiresInvoice?: boolean
  partNumber?: string
  description1?: string
  description2?: string
  description3?: string
  orderPayment?: string
  kilometersTraveled?: string
  locationPlace?: string
}

const fields: Array<{ key: keyof PdfOrderDraft; label: string; multiline?: boolean; type?: string; alertIfMissing?: boolean }> = [
  { key: 'orderNumber', label: 'Numero de orden', alertIfMissing: true },
  { key: 'orderDate', label: 'Fecha programada', alertIfMissing: true },
  { key: 'customerName', label: 'Nombre del cliente', alertIfMissing: true },
  { key: 'customerIdCard', label: 'Cedula / DPI', alertIfMissing: true },
  { key: 'locationPlace', label: 'Ciudad / municipio', alertIfMissing: true },
  { key: 'postalCode', label: 'Codigo postal', alertIfMissing: true },
  { key: 'description3', label: 'Direccion', multiline: true, alertIfMissing: true },
  { key: 'crossStreets', label: 'Entre calles', multiline: true, alertIfMissing: true },
  { key: 'neighborhood', label: 'Barrio / colonia', alertIfMissing: true },
  { key: 'homePhone', label: 'Telefono casa', alertIfMissing: true },
  { key: 'cellPhone', label: 'Telefono celular', alertIfMissing: true },
  { key: 'officePhone', label: 'Telefono oficina', alertIfMissing: true },
  { key: 'phoneExtension', label: 'Extension', alertIfMissing: true },
  { key: 'assignedToType', label: 'Tipo de servicio / asignado a', alertIfMissing: true },
  { key: 'purchasePlaceOrigin', label: 'Lugar de compra origen', alertIfMissing: true },
  { key: 'technicianNumber', label: 'No. tecnico', alertIfMissing: true },
  { key: 'modelOrigin', label: 'Modelo origen', alertIfMissing: true },
  { key: 'moduleOrigin', label: 'Modulo', alertIfMissing: true },
  { key: 'serialNumberOrigin', label: 'No. de serie origen', alertIfMissing: true },
  { key: 'baseOrigin', label: 'Base', alertIfMissing: true },
  { key: 'productDescriptionOrigin', label: 'Descripcion producto', multiline: true, alertIfMissing: true },
  { key: 'description1', label: 'Falla reportada / quien reporta', multiline: true, alertIfMissing: true },
  { key: 'confirmedPurchasePlace', label: 'Lugar de compra confirmado', alertIfMissing: true },
  { key: 'confirmedInvoiceNumber', label: 'No. factura', alertIfMissing: true },
  { key: 'confirmedPurchaseDate', label: 'Fecha compra', alertIfMissing: true },
  { key: 'confirmedBrand', label: 'Marca confirmada', alertIfMissing: true },
  { key: 'confirmedModel', label: 'Modelo confirmado', alertIfMissing: true },
  { key: 'confirmedSerialNumber', label: 'Serie confirmada', alertIfMissing: true },
  { key: 'partNumber', label: 'No. parte / refaccion', alertIfMissing: true },
  { key: 'description2', label: 'Descripcion del trabajo', multiline: true, alertIfMissing: true },
  { key: 'orderPayment', label: 'Total / pago', type: 'number', alertIfMissing: true },
  { key: 'kilometersTraveled', label: 'Kilometros', type: 'number', alertIfMissing: true },
]

const isMissing = (order: PdfOrderDraft, key: keyof PdfOrderDraft) => {
  const value = order[key]
  return value === undefined || value === null || String(value).trim() === ''
}

const missingCount = (order: PdfOrderDraft) => fields.filter((field) => field.alertIfMissing && isMissing(order, field.key)).length

export function PdfImportPage() {
  const [draftId, setDraftId] = useState<string>()
  const [orders, setOrders] = useState<PdfOrderDraft[]>([])
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const upload = useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.append('pdf', file)
      return api<any>('/pdf-imports', { method: 'POST', body: form })
    },
    onSuccess: (result) => {
      setDraftId(result.id)
      setOrders(result.extractedPayload?.orders ?? [])
    },
  })

  const confirm = useMutation({
    mutationFn: () => api(`/pdf-imports/${draftId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ orders }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate('/')
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'No se pudieron registrar las ordenes.')
    },
  })

  function updateOrder(index: number, key: keyof PdfOrderDraft, value: string | boolean) {
    setOrders((current) =>
      current.map((order, orderIndex) =>
        orderIndex === index ? { ...order, [key]: value } : order,
      ),
    )
  }

  return (
    <section className="page-stack">
      <div className="upload-panel">
        <FileText size={34} />
        <div>
          <p className="eyebrow">Importacion</p>
          <h2>Subir PDF de ordenes</h2>
          <p className="muted">El sistema extrae todas las ordenes del PDF, las mapea y permite editar cada campo antes de registrar.</p>
        </div>
        <label className="file-button">
          <UploadCloud size={18} /> Seleccionar PDF
          <input type="file" accept="application/pdf" onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) upload.mutate(file)
          }} />
        </label>
      </div>

      {upload.isPending && <p className="muted">Extrayendo informacion del PDF...</p>}

      {orders.length > 0 && (
        <section className="page-stack">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Revision editable</p>
              <h2>{orders.length} ordenes detectadas</h2>
            </div>
            <button className="primary-button" onClick={() => confirm.mutate()} disabled={confirm.isPending || !draftId}>
              <Save size={18} /> Registrar todas
            </button>
          </div>

          {orders.map((order, index) => (
            <article className="pdf-order-card" key={`${order.orderNumber}-${index}`}>
              <div className="pdf-order-head">
                <div>
                  <span>Orden {index + 1}</span>
                  <h3>{order.orderNumber || 'Sin numero'}</h3>
                  {missingCount(order) > 0 && (
                    <p className="pdf-warning">{missingCount(order)} campos sin informacion. Puedes guardarlos asi o completarlos.</p>
                  )}
                </div>
                <strong>{order.customerName || 'Cliente sin nombre'}</strong>
              </div>

              <div className="field-grid">
                {fields.map((field) => {
                  const missing = Boolean(field.alertIfMissing && isMissing(order, field.key))
                  return (
                  <label className={`${field.multiline ? 'field-wide' : ''} ${missing ? 'field-missing' : ''}`} key={field.key}>
                    {field.label}
                    {missing && <small>Completar si aplica</small>}
                    {field.multiline ? (
                      <textarea
                        rows={3}
                        value={String(order[field.key] ?? '')}
                        onChange={(event) => updateOrder(index, field.key, event.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type ?? 'text'}
                        value={String(order[field.key] ?? '')}
                        onChange={(event) => updateOrder(index, field.key, event.target.value)}
                      />
                    )}
                  </label>
                )})}
                <label className="checkbox-field field-wide">
                  <input
                    type="checkbox"
                    checked={Boolean(order.requiresInvoice)}
                    onChange={(event) => updateOrder(index, 'requiresInvoice', event.target.checked)}
                  />
                  Requiere factura
                </label>
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  )
}
