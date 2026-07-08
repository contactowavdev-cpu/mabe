import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { queueMutation } from '../../lib/offline'

type OrderForm = {
  orderNumber: string
  customerName: string
  cellPhone?: string
  neighborhood?: string
  description1?: string
}

export function NewOrderPage() {
  const { register, handleSubmit } = useForm<OrderForm>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (values: OrderForm) => api('/orders', { method: 'POST', body: JSON.stringify(values) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate('/')
    },
    onError: async (_error, values) => {
      await queueMutation({ method: 'POST', path: '/orders', body: values })
      navigate('/')
    },
  })

  return (
    <form className="form-card" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Ingreso manual</p>
          <h2>Nueva orden</h2>
        </div>
      </div>
      <label>Numero de orden<input {...register('orderNumber', { required: true })} placeholder="Ej. 55551984" /></label>
      <label>Cliente<input {...register('customerName', { required: true })} placeholder="Nombre del cliente" /></label>
      <label>Celular<input inputMode="tel" {...register('cellPhone')} placeholder="Telefono principal" /></label>
      <label>Barrio / zona<input {...register('neighborhood')} placeholder="Ubicacion o zona" /></label>
      <label>Falla reportada<textarea rows={4} {...register('description1')} placeholder="Describe la falla inicial" /></label>
      <button className="primary-button" disabled={mutation.isPending}>
        <Save size={18} /> Guardar orden
      </button>
    </form>
  )
}
