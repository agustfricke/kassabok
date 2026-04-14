import { useStore } from '@/store'
import type { Product } from '@/store'

export function ProductsPage() {
  const products = useStore((s) => s.products)
  const cart = useStore((s) => s.cart)
  const selectProduct = useStore((s) => s.selectProduct)

  function cartQty(productId: string) {
    return cart.find((c) => c.productId === productId)?.quantity ?? 0
  }

  return (
    <div className="h-full overflow-y-auto p-3">
      {products.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">Inga produkter än.</p>
          <p className="text-xs">Gå till Hantera för att lägga till.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {products.map((product: Product) => (
            <button
              key={product.id}
              onClick={() => selectProduct(product)}
              className="group relative flex flex-col rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent active:scale-95"
            >
              {cartQty(product.id) > 0 && (
                <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                  {cartQty(product.id)}
                </span>
              )}
              <span className="mt-1 line-clamp-2 text-sm font-medium leading-tight">
                {product.name}
              </span>
              <span className="mt-1.5 text-sm font-semibold">
                {product.price.toFixed(0)} kr
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
