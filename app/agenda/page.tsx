import { createServerClient } from '@/lib/supabase/server'
import { WeekGrid } from '@/components/agenda/week-grid'
import { buttonVariants } from '@/components/ui/button'
import { addWeeks, startOfWeek, endOfWeek, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const { week: weekStr } = await searchParams
  const weekOffset = parseInt(weekStr ?? '0', 10)

  const today = new Date()
  const refDate = addWeeks(today, weekOffset)
  const weekStart = startOfWeek(refDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(refDate, { weekStartsOn: 1 })

  const supabase = createServerClient()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, leads(*), services(*)')
    .gte('start_at', weekStart.toISOString())
    .lte('start_at', weekEnd.toISOString())
    .order('start_at', { ascending: true })

  const weekLabel = format(weekStart, "'Semana del' d 'de' MMMM yyyy", { locale: es })
  const btnCls = cn(buttonVariants({ variant: 'outline', size: 'sm' }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <div className="flex items-center gap-2">
          <Link href={`/agenda?week=${weekOffset - 1}`} className={btnCls}>
            <ChevronLeft size={16} />
          </Link>
          <span className="text-sm text-muted-foreground min-w-52 text-center">
            {weekLabel}
          </span>
          <Link href={`/agenda?week=${weekOffset + 1}`} className={btnCls}>
            <ChevronRight size={16} />
          </Link>
          {weekOffset !== 0 && (
            <Link href="/agenda" className={btnCls}>
              Hoy
            </Link>
          )}
        </div>
      </div>
      <WeekGrid appointments={appointments ?? []} weekStart={weekStart} />
    </div>
  )
}
