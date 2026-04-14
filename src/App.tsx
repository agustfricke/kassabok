import { useState } from 'react'
import { BottomNav } from '@/components/BottomNav'
import type { Page } from '@/components/BottomNav'
import { ProductsPage } from '@/pages/ProductsPage'
import { CartPage } from '@/pages/CartPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { ManagePage } from '@/pages/ManagePage'
import { useStore } from '@/store'

function App() {
  const [page, setPage] = useState<Page>('products')
  const cart = useStore((s) => s.cart)
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0)

  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex-1 overflow-hidden pb-16">
        {page === 'products' && <ProductsPage />}
        {page === 'cart' && <CartPage />}
        {page === 'history' && <HistoryPage />}
        {page === 'manage' && <ManagePage />}
      </div>
      <BottomNav active={page} cartCount={cartCount} onNavigate={setPage} />
    </div>
  )
}

export default App
