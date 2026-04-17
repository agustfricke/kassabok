import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import type { CartItem } from '@/store'

export function CartPage() {
  const cart = useStore((s) => s.cart)
  const updateCartQuantity = useStore((s) => s.updateCartQuantity)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const confirmSale = useStore((s) => s.confirmSale)

  const total = cart.reduce((sum, c) => sum + c.productPrice * c.quantity, 0)

  function handleConfirm() {
    confirmSale()
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {cart.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Varukorgen är tom
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-border">
            {cart.map((item: CartItem) => (
              <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.productPrice.toFixed(0)} kr/st
                  </p>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCartQuantity(item.productId, -1)}
                    className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, 1)}
                    className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Line total */}
                <span className="w-16 text-right text-sm font-semibold">
                  {(item.productPrice * item.quantity).toFixed(0)} kr
                </span>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="rounded-md p-1 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Totalt:</span>
              <span className="text-lg font-bold">{total.toFixed(0)} kr</span>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-base font-semibold"
              onClick={handleConfirm}
            >
              Slutför köp
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
