import { useState } from 'react'
import { X, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import type { Product } from '@/store'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export function ProductManagementDrawer({ open, onClose }: Props) {
  const products = useStore((s) => s.products)
  const addProduct = useStore((s) => s.addProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(price.replace(',', '.'))
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return
    addProduct(name.trim(), parsed)
    setName('')
    setPrice('')
    setShowForm(false)
  }

  function handleClose() {
    setShowForm(false)
    setName('')
    setPrice('')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/60 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed bottom-0 left-0 top-0 z-50 flex w-80 max-w-[90vw] flex-col bg-card shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-4">
          <div>
            <h2 className="text-base font-semibold">Produkthantering</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Skapa och ta bort produkter
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* New product button / form */}
        <div className="border-b border-border p-4">
          {!showForm ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="size-4" />
              Ny produkt
            </Button>
          ) : (
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                autoFocus
                type="text"
                placeholder="Produktnamn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <input
                type="text"
                inputMode="decimal"
                placeholder="Pris (kr)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  Lägg till
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowForm(false)
                    setName('')
                    setPrice('')
                  }}
                >
                  Avbryt
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Products list */}
        <div className="flex-1 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground">
            Produkter ({products.length})
          </p>
          {products.length === 0 ? (
            <p className="px-4 py-2 text-sm text-muted-foreground">
              Inga produkter ännu.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {products.map((p: Product) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.price.toFixed(0)} kr
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
