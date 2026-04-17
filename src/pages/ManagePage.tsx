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
  const categories = useStore((s) => s.categories ?? [])
  const addProduct = useStore((s) => s.addProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const importProducts = useStore((s) => s.importProducts)
  const addCategory = useStore((s) => s.addCategory)
  const deleteCategory = useStore((s) => s.deleteCategory)
  const setProductCategory = useStore((s) => s.setProductCategory)

  const [tab, setTab] = useState<'products' | 'categories'>('products')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [catName, setCatName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(price.replace(',', '.'))
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return
    addProduct(name.trim(), parsed, categoryId || undefined)
    setName('')
    setPrice('')
    setCategoryId('')
    setShowForm(false)
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!catName.trim()) return
    addCategory(catName.trim())
    setCatName('')
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
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-semibold">Hantera</h1>
          <p className="text-xs text-muted-foreground">Produkter och kategorier</p>
        </div>
        {tab === 'products' && !showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" />
            Ny produkt
          </Button>
        )}
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => { setTab('products'); setShowForm(false) }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === 'products'
              ? 'border-b-2 border-foreground text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Produkter
        </button>
        <button
          onClick={() => { setTab('categories'); setShowForm(false) }}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tab === 'categories'
              ? 'border-b-2 border-foreground text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Kategorier
        </button>
      </div>

      {tab === 'products' && (
        <>
          {/* Create form */}
          {showForm && (
            <div className="border-b border-border p-4">
              <form onSubmit={handleAdd} className="space-y-3">
                <input
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
                {categories.length > 0 && (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-ring"
                  >
                    <option value="">Ingen kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Lägg till</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowForm(false); setName(''); setPrice(''); setCategoryId('') }}
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
          <div className="min-h-0 flex-1 overflow-y-auto">
            <p className="px-4 py-2 text-xs font-medium text-muted-foreground">
              Produkter ({products.length})
            </p>
            {products.length === 0 ? (
              <p className="px-4 text-sm text-muted-foreground">Inga produkter ännu.</p>
            ) : (
              <ul className="divide-y divide-border">
                {products.map((p: Product) => (
                  <li key={p.id} className="flex items-center gap-2 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.price.toFixed(0)} kr</p>
                    </div>
                    {categories.length > 0 && (
                      <select
                        value={p.categoryId ?? ''}
                        onChange={(e) => setProductCategory(p.id, e.target.value || null)}
                        className="h-7 shrink-0 rounded border border-input bg-background px-1.5 text-xs text-foreground outline-none focus:border-ring"
                      >
                        <option value="">Ingen</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="shrink-0 rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {tab === 'categories' && (
        <>
          {/* Add category form */}
          <div className="border-b border-border p-4">
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="Kategorinamn"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <Button type="submit" size="sm">
                <Plus className="size-4" />
                Lägg till
              </Button>
            </form>
          </div>

          {/* Category list */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {categories.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <p className="text-sm">Inga kategorier ännu.</p>
                <p className="text-xs">Skriv ett namn ovan för att skapa en.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {categories.map((c) => {
                  const count = products.filter((p) => p.categoryId === c.id).length
                  return (
                    <li key={c.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{count} produkter</p>
                      </div>
                      <button
                        onClick={() => deleteCategory(c.id)}
                        className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
