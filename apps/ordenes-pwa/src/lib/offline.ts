import { openDB } from 'idb'

const dbPromise = openDB('ordenes-offline', 1, {
  upgrade(db) {
    db.createObjectStore('orders-cache')
    db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true })
  },
})

export async function cacheOrders(orders: unknown) {
  const db = await dbPromise
  await db.put('orders-cache', orders, 'latest')
}

export async function getCachedOrders<T>() {
  const db = await dbPromise
  return db.get('orders-cache', 'latest') as Promise<T | undefined>
}

export async function queueMutation(payload: unknown) {
  const db = await dbPromise
  await db.add('sync-queue', { payload, createdAt: new Date().toISOString() })
}
