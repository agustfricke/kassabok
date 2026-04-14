import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../lib/nanoid'

export interface Product {
  id: string
  name: string
  price: number
  timesSelected: number
}

export interface CartItem {
  productId: string
  productName: string
  productPrice: number
  quantity: number
}

export interface SaleItem {
  name: string
  price: number
  quantity: number
}

export interface Sale {
  id: string
  date: string
  items: SaleItem[]
  total: number
}

interface AppStore {
  products: Product[]
  cart: CartItem[]
  history: Sale[]

  addProduct: (name: string, price: number) => void
  deleteProduct: (id: string) => void
  selectProduct: (product: Product) => void
  importProducts: (products: Pick<Product, 'id' | 'name' | 'price'>[]) => void

  updateCartQuantity: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  confirmSale: () => void

  deleteHistoryEntry: (id: string) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      history: [],

      addProduct: (name, price) =>
        set((s) => ({
          products: [
            ...s.products,
            { id: nanoid(), name, price, timesSelected: 0 },
          ],
        })),

      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          cart: s.cart.filter((c) => c.productId !== id),
        })),

      selectProduct: (product) => {
        set((s) => {
          const existing = s.cart.find((c) => c.productId === product.id)
          const cart = existing
            ? s.cart.map((c) =>
                c.productId === product.id
                  ? { ...c, quantity: c.quantity + 1 }
                  : c,
              )
            : [
                ...s.cart,
                {
                  productId: product.id,
                  productName: product.name,
                  productPrice: product.price,
                  quantity: 1,
                },
              ]
          const products = s.products.map((p) =>
            p.id === product.id
              ? { ...p, timesSelected: p.timesSelected + 1 }
              : p,
          )
          return { cart, products }
        })
      },

      importProducts: (incoming) =>
        set(() => ({
          products: incoming.map((p) => ({
            id: p.id ?? nanoid(),
            name: p.name,
            price: p.price,
            timesSelected: 0,
          })),
        })),

      updateCartQuantity: (productId, delta) =>
        set((s) => ({
          cart: s.cart
            .map((c) =>
              c.productId === productId
                ? { ...c, quantity: c.quantity + delta }
                : c,
            )
            .filter((c) => c.quantity > 0),
        })),

      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),

      confirmSale: () => {
        const { cart } = get()
        if (!cart.length) return
        const total = cart.reduce((sum, c) => sum + c.productPrice * c.quantity, 0)
        const sale: Sale = {
          id: nanoid(),
          date: new Date().toISOString(),
          items: cart.map((c) => ({
            name: c.productName,
            price: c.productPrice,
            quantity: c.quantity,
          })),
          total,
        }
        set((s) => ({ cart: [], history: [sale, ...s.history] }))
      },

      deleteHistoryEntry: (id) =>
        set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
    }),
    {
      name: 'swish-pos',
      partialize: (s) => ({
        products: s.products,
        cart: s.cart,
        history: s.history,
      }),
    },
  ),
)
