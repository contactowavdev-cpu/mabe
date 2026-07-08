import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckCircle2, Download, Eraser, PenLine } from 'lucide-react'
import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL, api } from '../../lib/api'
import { Order } from '../../lib/types'

const field = (value?: string | number | null) => value || 'No registrado'

export function PublicOrderPage() {
  const { token } = useParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [isSigned, setIsSigned] = useState(false)
  const [saved, setSaved] = useState(false)

  const query = useQuery({
    queryKey: ['public-order', token],
    queryFn: () => api<Order>(`/public/orders/${token}`),
  })
  const sign = useMutation({
    mutationFn: (signatureDataUrl: string) =>
      api(`/public/orders/${token}/signature`, {
        method: 'POST',
        body: JSON.stringify({ signatureDataUrl }),
      }),
    onSuccess: () => {
      setSaved(true)
      query.refetch()
    },
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const box = boxRef.current
    if (!canvas || !box) return

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const rect = box.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * ratio)
      canvas.height = Math.floor(220 * ratio)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = '220px'

      const context = canvas.getContext('2d')
      if (!context) return
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, rect.width, 220)
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = 2.2
      context.strokeStyle = '#071a2f'
      setIsSigned(false)
      setSaved(false)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const order = query.data
  const pdfUrl = `${API_URL}/public/orders/${token}/service-confirmation.pdf`
  const serviceRows = useMemo(() => {
    if (!order) return []

    return [
      ['Cliente', field(order.customerName)],
      ['Telefono', field(order.cellPhone || order.homePhone || order.officePhone)],
      ['Direccion', field(order.description3 || order.neighborhood || order.locationPlace)],
      ['Producto', field(order.productDescriptionOrigin)],
      ['Marca', field(order.confirmedBrand || 'Mabe')],
      ['Modelo', field(order.confirmedModel || order.modelOrigin)],
      ['Serie', field(order.confirmedSerialNumber || order.serialNumberOrigin)],
      ['Lugar de compra', field(order.confirmedPurchasePlace || order.purchasePlaceOrigin)],
      ['Factura', field(order.confirmedInvoiceNumber)],
      ['Falla reportada', field(order.description1)],
      ['Trabajo realizado', field(order.description2)],
    ]
  }, [order])

  function getCanvasPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const point = getCanvasPoint(event)
    if (!canvas || !point) return
    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastPointRef.current = point
  }

  function draw(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    const context = canvasRef.current?.getContext('2d')
    const previous = lastPointRef.current
    const point = getCanvasPoint(event)
    if (!context || !previous || !point) return
    event.preventDefault()
    context.beginPath()
    context.moveTo(previous.x, previous.y)
    context.lineTo(point.x, point.y)
    context.stroke()
    lastPointRef.current = point
    setIsSigned(true)
    setSaved(false)
  }

  function stopDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return
    event.preventDefault()
    drawingRef.current = false
    lastPointRef.current = null
  }

  function clearSignature() {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const rect = canvas.getBoundingClientRect()
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, rect.width, rect.height)
    setIsSigned(false)
    setSaved(false)
  }

  if (!order) return <p className="muted public-pad">Cargando orden...</p>

  return (
    <main className="public-screen">
      <section className="public-panel service-confirmation">
        <header className="service-header">
          <div className="mabe-logo" aria-label="Mabe">mabe</div>
          <div>
            <p className="eyebrow">Confirmacion de servicio</p>
            <h1>Orden {order.orderNumber}</h1>
            <span>{order.status?.name ?? 'Finalizado'}</span>
          </div>
        </header>

        <div className="service-summary">
          <strong>{order.customerName}</strong>
          <span>{field(order.productDescriptionOrigin || order.confirmedModel || order.modelOrigin)}</span>
        </div>

        <div className="service-fields">
          {serviceRows.map(([label, value]) => (
            <div className="service-field" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <section className="signature-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Firma del cliente</p>
              <h2>Confirmo el servicio recibido</h2>
            </div>
            <PenLine size={24} />
          </div>

          <div className="signature-box" ref={boxRef}>
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>

          <div className="signature-actions">
            <button className="secondary-button" type="button" onClick={clearSignature}>
              <Eraser size={18} /> Limpiar
            </button>
            <button
              className="primary-button"
              disabled={!isSigned || sign.isPending}
              onClick={() => {
                const canvas = canvasRef.current
                if (!canvas || !isSigned) {
                  alert('Dibuja la firma antes de guardar.')
                  return
                }
                sign.mutate(canvas.toDataURL('image/png'))
              }}
            >
              <CheckCircle2 size={18} /> {sign.isPending ? 'Guardando...' : 'Guardar firma'}
            </button>
          </div>

          {(saved || order.clientSignaturePath) && (
            <div className="signed-download">
              <p className="success-note">Firma guardada correctamente. Descarga la confirmacion en PDF.</p>
              <a className="primary-button" href={pdfUrl} target="_blank" rel="noreferrer">
                <Download size={18} /> Descargar PDF
              </a>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
