import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Camera, CheckCircle2, Copy, Download, Image, MapPin, Phone, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL, api } from '../../lib/api'
import { useAuthStore } from '../../lib/auth-store'
import { Order, OrderStatus } from '../../lib/types'

type EditableOrderField = keyof Pick<
  Order,
  | 'orderNumber'
  | 'orderDate'
  | 'customerName'
  | 'customerIdCard'
  | 'locationPlace'
  | 'postalCode'
  | 'description3'
  | 'crossStreets'
  | 'neighborhood'
  | 'homePhone'
  | 'cellPhone'
  | 'officePhone'
  | 'phoneExtension'
  | 'assignedToType'
  | 'purchasePlaceOrigin'
  | 'technicianNumber'
  | 'modelOrigin'
  | 'moduleOrigin'
  | 'serialNumberOrigin'
  | 'baseOrigin'
  | 'productDescriptionOrigin'
  | 'confirmedPurchasePlace'
  | 'confirmedInvoiceNumber'
  | 'confirmedPurchaseDate'
  | 'confirmedBrand'
  | 'confirmedModel'
  | 'confirmedSerialNumber'
  | 'requiresInvoice'
  | 'partNumber'
  | 'description1'
  | 'description2'
  | 'orderPayment'
  | 'kilometersTraveled'
  | 'fuelCost'
>

type EditableOrder = Partial<Record<EditableOrderField, string | boolean>>

const fieldSections: Array<{
  title: string
  description: string
  fields: Array<{ key: EditableOrderField; label: string; multiline?: boolean; type?: string }>
}> = [
  {
    title: 'Datos de la orden',
    description: 'Estos datos vienen del PDF importado y tambien alimentan el PDF tecnico.',
    fields: [
      { key: 'orderNumber', label: 'No. orden' },
      { key: 'orderDate', label: 'Fecha programada' },
      { key: 'customerName', label: 'Nombre del cliente' },
      { key: 'customerIdCard', label: 'Cedula / DPI' },
      { key: 'locationPlace', label: 'Delegacion o municipio' },
      { key: 'postalCode', label: 'Codigo postal' },
      { key: 'description3', label: 'Direccion', multiline: true },
      { key: 'crossStreets', label: 'Entre calles', multiline: true },
      { key: 'neighborhood', label: 'Colonia' },
      { key: 'homePhone', label: 'Tel. casa' },
      { key: 'cellPhone', label: 'Tel. cel.' },
      { key: 'officePhone', label: 'Tel. oficina' },
      { key: 'phoneExtension', label: 'Ext.' },
    ],
  },
  {
    title: 'Orden tecnica',
    description: 'Informacion que necesita el tecnico antes de cerrar el servicio.',
    fields: [
      { key: 'assignedToType', label: 'Tipo servicio' },
      { key: 'purchasePlaceOrigin', label: 'Lugar de compra' },
      { key: 'technicianNumber', label: 'No. tecnico' },
      { key: 'modelOrigin', label: 'Modelo' },
      { key: 'moduleOrigin', label: 'Modulo' },
      { key: 'serialNumberOrigin', label: 'No. de serie' },
      { key: 'baseOrigin', label: 'Base' },
      { key: 'productDescriptionOrigin', label: 'Descripcion producto', multiline: true },
      { key: 'description1', label: 'Falla reportada / quien', multiline: true },
      { key: 'partNumber', label: 'No. parte / refaccion' },
    ],
  },
  {
    title: 'Confirmacion para cliente',
    description: 'Estos valores salen en la confirmacion que el cliente firma.',
    fields: [
      { key: 'confirmedPurchasePlace', label: 'Lugar de compra confirmado' },
      { key: 'confirmedInvoiceNumber', label: 'No. factura' },
      { key: 'confirmedPurchaseDate', label: 'Fecha compra' },
      { key: 'confirmedBrand', label: 'Marca confirmada' },
      { key: 'confirmedModel', label: 'Modelo confirmado' },
      { key: 'confirmedSerialNumber', label: 'Serie confirmada' },
      { key: 'description2', label: 'Descripcion del trabajo', multiline: true },
      { key: 'kilometersTraveled', label: 'Kilometros', type: 'number' },
      { key: 'fuelCost', label: 'Gasolina', type: 'number' },
      { key: 'orderPayment', label: 'Pago / total', type: 'number' },
    ],
  },
]

const editableValue = (value: unknown) => value === null || value === undefined ? '' : String(value)

async function compressPhotoForUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecciona un archivo de imagen valido.')
  }

  const imageUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement('img')
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('No se pudo leer la imagen. Si es HEIC, cambia la camara a JPG o selecciona otra foto.'))
      img.src = imageUrl
    })

    const maxSide = 1600
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight))
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('No se pudo preparar la compresion de la foto.')
    context.drawImage(image, 0, 0, width, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((nextBlob) => {
        if (nextBlob) resolve(nextBlob)
        else reject(new Error('No se pudo comprimir la foto.'))
      }, 'image/jpeg', 0.72)
    })

    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

function orderToForm(order: Order): EditableOrder {
  return {
    orderNumber: editableValue(order.orderNumber),
    orderDate: editableValue(order.orderDate),
    customerName: editableValue(order.customerName),
    customerIdCard: editableValue(order.customerIdCard),
    locationPlace: editableValue(order.locationPlace),
    postalCode: editableValue(order.postalCode),
    description3: editableValue(order.description3),
    crossStreets: editableValue(order.crossStreets),
    neighborhood: editableValue(order.neighborhood),
    homePhone: editableValue(order.homePhone),
    cellPhone: editableValue(order.cellPhone),
    officePhone: editableValue(order.officePhone),
    phoneExtension: editableValue(order.phoneExtension),
    assignedToType: editableValue(order.assignedToType),
    purchasePlaceOrigin: editableValue(order.purchasePlaceOrigin),
    technicianNumber: editableValue(order.technicianNumber),
    modelOrigin: editableValue(order.modelOrigin),
    moduleOrigin: editableValue(order.moduleOrigin),
    serialNumberOrigin: editableValue(order.serialNumberOrigin),
    baseOrigin: editableValue(order.baseOrigin),
    productDescriptionOrigin: editableValue(order.productDescriptionOrigin),
    confirmedPurchasePlace: editableValue(order.confirmedPurchasePlace),
    confirmedInvoiceNumber: editableValue(order.confirmedInvoiceNumber),
    confirmedPurchaseDate: editableValue(order.confirmedPurchaseDate),
    confirmedBrand: editableValue(order.confirmedBrand),
    confirmedModel: editableValue(order.confirmedModel),
    confirmedSerialNumber: editableValue(order.confirmedSerialNumber),
    requiresInvoice: Boolean(order.requiresInvoice),
    partNumber: editableValue(order.partNumber),
    description1: editableValue(order.description1),
    description2: editableValue(order.description2),
    kilometersTraveled: editableValue(order.kilometersTraveled),
    fuelCost: editableValue(order.fuelCost),
    orderPayment: editableValue(order.orderPayment),
  }
}

function formToPayload(form: EditableOrder) {
  const cleanText = (key: EditableOrderField) => {
    const value = form[key]
    if (typeof value !== 'string') return undefined
    const trimmed = value.trim()
    return trimmed ? trimmed : undefined
  }
  const cleanNumber = (key: EditableOrderField) => {
    const value = cleanText(key)
    return value === undefined ? undefined : Number(value)
  }

  return {
    orderNumber: cleanText('orderNumber') ?? 'SIN-NUMERO',
    orderDate: cleanText('orderDate'),
    customerName: cleanText('customerName') ?? 'Sin cliente',
    customerIdCard: cleanText('customerIdCard'),
    locationPlace: cleanText('locationPlace'),
    postalCode: cleanText('postalCode'),
    description3: cleanText('description3'),
    crossStreets: cleanText('crossStreets'),
    neighborhood: cleanText('neighborhood'),
    homePhone: cleanText('homePhone'),
    cellPhone: cleanText('cellPhone'),
    officePhone: cleanText('officePhone'),
    phoneExtension: cleanText('phoneExtension'),
    assignedToType: cleanText('assignedToType'),
    purchasePlaceOrigin: cleanText('purchasePlaceOrigin'),
    technicianNumber: cleanText('technicianNumber'),
    modelOrigin: cleanText('modelOrigin'),
    moduleOrigin: cleanText('moduleOrigin'),
    serialNumberOrigin: cleanText('serialNumberOrigin'),
    baseOrigin: cleanText('baseOrigin'),
    productDescriptionOrigin: cleanText('productDescriptionOrigin'),
    confirmedPurchasePlace: cleanText('confirmedPurchasePlace'),
    confirmedInvoiceNumber: cleanText('confirmedInvoiceNumber'),
    confirmedPurchaseDate: cleanText('confirmedPurchaseDate'),
    confirmedBrand: cleanText('confirmedBrand'),
    confirmedModel: cleanText('confirmedModel'),
    confirmedSerialNumber: cleanText('confirmedSerialNumber'),
    requiresInvoice: Boolean(form.requiresInvoice),
    partNumber: cleanText('partNumber'),
    description1: cleanText('description1'),
    description2: cleanText('description2'),
    kilometersTraveled: cleanNumber('kilometersTraveled'),
    fuelCost: cleanNumber('fuelCost'),
    orderPayment: cleanNumber('orderPayment'),
  }
}

export function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const token = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const [form, setForm] = useState<EditableOrder>({})
  const [photoError, setPhotoError] = useState('')
  const query = useQuery({ queryKey: ['order', id], queryFn: () => api<Order>(`/orders/${id}`) })
  const statuses = useQuery({ queryKey: ['order-statuses'], queryFn: () => api<OrderStatus[]>('/order-statuses') })
  useEffect(() => {
    if (query.data) setForm(orderToForm(query.data))
  }, [query.data])

  const saveOrder = useMutation({
    mutationFn: () => api<Order>(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(formToPayload(form)),
    }),
    onSuccess: (updated) => {
      setForm(orderToForm(updated))
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      const compressed = await compressPhotoForUpload(file)
      const form = new FormData()
      form.append('photo', compressed)
      return api(`/orders/${id}/photos`, { method: 'POST', body: form })
    },
    onMutate: () => setPhotoError(''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      setPhotoError(error instanceof Error ? error.message : 'No se pudo subir la foto.')
    },
  })
  const complete = useMutation({
    mutationFn: async () => {
      await api<Order>(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(formToPayload(form)),
      })
      return api<Order>(`/orders/${id}/complete`, { method: 'POST' })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order', id] }),
  })
  const updateStatus = useMutation({
    mutationFn: (orderStatusId: string) => api<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ orderStatusId }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
  const deleteOrder = useMutation({
    mutationFn: () => api(`/orders/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate('/')
    },
  })

  const order = query.data
  if (!order) return <p className="muted">Cargando detalle...</p>
  const isReviewOnly = user?.role === 'admin' || user?.role === 'supervisor'
  const orderNumber = order.orderNumber
  const publicUrl = order.publicToken ? `${location.origin}/public/order/${order.publicToken}` : ''
  const updateField = (key: EditableOrderField, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))

  async function downloadOrderPdf() {
    const response = await fetch(`${API_URL}/orders/${id}/service-order.pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!response.ok) {
      alert('No se pudo generar el PDF de esta orden.')
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orden-servicio-${orderNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="page-stack">
      <div className="detail-hero">
        <span className="status-pill" style={{ backgroundColor: order.status.color }}>{order.status.name}</span>
        <p>Orden No.</p>
        <h2>{order.orderNumber}</h2>
        <strong>{order.customerName}</strong>
      </div>

      <div className="quick-info">
        <span><Phone size={16} /> {order.cellPhone || 'Sin telefono'}</span>
        <span><MapPin size={16} /> {order.neighborhood || 'Sin ubicacion'}</span>
      </div>

      <section className="order-tools">
        <label>
          Estado
          <select
            value={order.status?.id ?? ''}
            disabled={updateStatus.isPending || isReviewOnly}
            onChange={(event) => updateStatus.mutate(event.target.value)}
          >
            {statuses.data?.map((status) => (
              <option value={status.id} key={status.id}>{status.name}</option>
            ))}
          </select>
        </label>
        <button
          className="danger-button"
          onClick={() => {
            if (confirm(`Eliminar la orden ${order.orderNumber}? Esta accion no se puede deshacer.`)) {
              deleteOrder.mutate()
            }
          }}
          disabled={deleteOrder.isPending || isReviewOnly}
        >
          <Trash2 size={18} /> Eliminar
        </button>
      </section>

      <div className="detail-grid">
        <article><strong>Falla reportada</strong><p>{order.description1 || 'Sin datos'}</p></article>
        <article><strong>Trabajo realizado</strong><p>{order.description2 || 'Pendiente de registrar'}</p></article>
        <article><strong>Observaciones</strong><p>{order.description3 || 'Sin observaciones'}</p></article>
      </div>

      <section className="technical-form">
        <div className="section-heading">
          <div>
            <span>Ordenes tecnicas</span>
            <h3>Campos para llenar antes de firma</h3>
          </div>
          {!isReviewOnly ? <button className="primary-button compact" onClick={() => saveOrder.mutate()} disabled={saveOrder.isPending}>
            <Save size={18} /> {saveOrder.isPending ? 'Guardando...' : 'Guardar'}
          </button> : null}
        </div>

        {fieldSections.map((section) => (
          <div className="technical-section" key={section.title}>
            <div className="technical-section-head">
              <h4>{section.title}</h4>
              <p>{section.description}</p>
            </div>
            <div className="technical-field-grid">
              {section.fields.map((field) => (
                <label className={field.multiline ? 'span-2' : ''} key={field.key}>
                  {field.label}
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      value={editableValue(form[field.key])}
                      disabled={isReviewOnly}
                      onChange={(event) => updateField(field.key, event.target.value)}
                    />
                  ) : (
                    <input
                      type={field.type ?? 'text'}
                      value={editableValue(form[field.key])}
                      disabled={isReviewOnly}
                      onChange={(event) => updateField(field.key, event.target.value)}
                    />
                  )}
                </label>
              ))}
              <label className="checkbox-field span-2">
                <input
                  type="checkbox"
                  checked={Boolean(form.requiresInvoice)}
                  disabled={isReviewOnly}
                  onChange={(event) => updateField('requiresInvoice', event.target.checked)}
                />
                Requiere factura
              </label>
            </div>
          </div>
        ))}
      </section>

      <div className="action-row">
        <button className="secondary-button" onClick={downloadOrderPdf}>
          <Download size={18} /> PDF orden
        </button>
        {!isReviewOnly ? <label className="file-button">
          <Camera size={18} /> {uploadPhoto.isPending ? 'Subiendo...' : 'Tomar foto'}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/*" capture="environment" onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) uploadPhoto.mutate(file)
            event.currentTarget.value = ''
          }} />
        </label> : null}
      </div>

      {!isReviewOnly ? <div className="action-row">
        <button className="primary-button compact" onClick={() => complete.mutate()} disabled={complete.isPending}>
          <CheckCircle2 size={18} /> Finalizar
        </button>
        {publicUrl ? (
          <button className="secondary-button" onClick={() => navigator.clipboard.writeText(publicUrl)}>
            <Copy size={18} /> URL firma cliente
          </button>
        ) : (
          <button className="secondary-button" onClick={() => complete.mutate()} disabled={complete.isPending}>
            <Copy size={18} /> Generar URL firma
          </button>
        )}
      </div> : null}

      <section className="media-section">
        <div className="section-heading">
          <h3>Fotos</h3>
          <span>{order.photos.length}/10</span>
        </div>
        {photoError && <p className="inline-error">{photoError}</p>}
        {uploadPhoto.isPending && <p className="muted">Subiendo y convirtiendo foto a AVIF...</p>}
        <div className="photo-grid">
          {order.photos.length ? order.photos.map((photo) => (
            <a href={`${API_URL.replace('/api', '')}${photo.photoPath}`} key={photo.id}>
              <Image size={24} />
              <span>{photo.mimeType}</span>
            </a>
          )) : <p className="muted">Aun no hay fotos de esta orden.</p>}
        </div>
      </section>

    </section>
  )
}
