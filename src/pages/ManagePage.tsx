import { useRef, useState } from 'react'
import { Trash2, Plus, Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import type { Product } from '@/store'

function exportJSON(products: Product[]) {
  const data = products.map(({ id, name, price }) => ({ id, name, price }))
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'products.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function ManagePage() {
  const products = useStore((s) => s.products)
  const addProduct = useStore((s) => s.addProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const importProducts = useStore((s) => s.importProducts)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(price.replace(',', '.'))
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return
    addProduct(name.trim(), parsed)
    setName('')
    setPrice('')
    setShowForm(false)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        if (!Array.isArray(json)) throw new Error()
        importProducts(json)
      } catch {
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-semibold">Produkthantering</h1>
          <p className="text-xs text-muted-foreground">Skapa och ta bort produkter</p>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Ny produkt
          </Button>
        )}
      </header>

      {/* Create form */}
      {showForm && (
        <div className="border-b border-border p-4">
          <form onSubmit={handleAdd} className="space-y-3">
            <input
              autoFocus
              type="text"
              placeholder="Produktnamn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <input
              type="text"
              inputMode="decimal"
              placeholder="Pris (kr)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Lägg till</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); setName(''); setPrice('') }}
              >
                Avbryt
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Import / Export */}
      <div className="flex gap-2 border-b border-border px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          Importera JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={products.length === 0}
          onClick={() => exportJSON(products)}
        >
          <Download className="size-4" />
          Exportera JSON
        </Button>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground">
          Produkter ({products.length})
        </p>
        {products.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">Inga produkter ännu.</p>
        ) : (
          <ul className="divide-y divide-border">
            {products.map((p: Product) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.price.toFixed(0)} kr</p>
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
  )
}
