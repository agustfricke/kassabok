import { ShoppingBag, ShoppingCart, Clock, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Page = 'products' | 'cart' | 'history' | 'manage'

interface Props {
  active: Page
  cartCount: number
  onNavigate: (page: Page) => void
}

const tabs = [
  { id: 'products' as Page, label: 'Produkter', Icon: ShoppingBag },
  { id: 'cart' as Page, label: 'Varukorg', Icon: ShoppingCart },
  { id: 'history' as Page, label: 'Historia', Icon: Clock },
  { id: 'manage' as Page, label: 'Hantera', Icon: Settings },
]

export function BottomNav({ active, cartCount, onNavigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card">
      <div className="flex h-16">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div className="relative">
                <Icon className={cn('size-5', isActive && 'stroke-[2.5px]')} />
                {id === 'cart' && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className={cn(isActive && 'font-medium')}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
