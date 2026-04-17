import { Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store'
import type { Sale } from '@/store'

function formatDate(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const time = d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

function exportCSV(history: Sale[]) {
  const rows: string[][] = [['Datum', 'Produkt', 'Antal', 'Styckpris', 'Delsumma', 'Totalt']]
  for (const sale of history) {
    sale.items.forEach((item, i) => {
      rows.push([
        i === 0 ? formatDate(sale.date) : '',
        item.name,
        String(item.quantity),
        item.price.toFixed(2),
        (item.price * item.quantity).toFixed(2),
        i === 0 ? sale.total.toFixed(2) : '',
      ])
    })
  }
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forsaljning-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function HistoryPage() {
  const history = useStore((s) => s.history)
  const deleteHistoryEntry = useStore((s) => s.deleteHistoryEntry)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {history.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Ingen försäljningshistorik ännu
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-border">
          <div className="flex justify-end px-4 py-2">
            <Button variant="outline" size="sm" onClick={() => exportCSV(history)}>
              <Download className="size-4" />
              Exportera CSV
            </Button>
          </div>
          {history.map((sale: Sale) => (
            <div key={sale.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{formatDate(sale.date)}</p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {sale.total.toFixed(0)} kr
                  </p>
                </div>
                <button
                  onClick={() => deleteHistoryEntry(sale.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <ul className="mt-2 space-y-0.5">
                {sale.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {item.quantity > 1 && (
                        <span className="mr-1 font-medium text-foreground">{item.quantity}×</span>
                      )}
                      {item.name}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(0)} kr</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
