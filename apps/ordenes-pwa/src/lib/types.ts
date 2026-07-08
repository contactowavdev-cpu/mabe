export type Role = 'superadmin' | 'admin' | 'supervisor' | 'technician'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type OrderStatus = {
  id: string
  name: string
  color: string
  icon: string
  priority: number
}

export type OrderPhoto = {
  id: string
  photoPath: string
  mimeType: string
  size: number
}

export type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerIdCard?: string
  postalCode?: string
  crossStreets?: string
  cellPhone?: string
  homePhone?: string
  officePhone?: string
  phoneExtension?: string
  neighborhood?: string
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
  orderPayment?: string | number
  kilometersTraveled?: string
  locationPlace?: string
  orderDate: string
  publicToken?: string
  clientSignaturePath?: string
  isCompleted: boolean
  status: OrderStatus
  photos: OrderPhoto[]
  technician?: User
}
