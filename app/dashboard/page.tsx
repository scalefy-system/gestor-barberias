import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  startOfDay, endOfDay, startOfWeek, addDays, subDays, subMonths, format,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, MessageSquare, TrendingUp, DollarSign, Clock, BarChart3, Bell } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const now = new Date()

  const todayStart = startOfDay(now).toISOString()
  const todayEnd = endOfDay(now).toISOString()
  const weekMonday = startOfWeek(now, { weekStartsOn: 1 })
  const weekStart = weekMonday.toISOString()
  const weekEnd = endOfDay(addDays(weekMonday, 5)).toISOString()
  const sevenDaysAgo = subDays(now, 7).toISOString()
  const oneMonthAgo = subMonths(now, 1).toISOString()

  const [
    { count: todayCount },
    { count: weekCount },
    { count: activeConvs },
    { data: unreadRows },
    { data: weekAppts },
    { data: lastMonthAppts },
    { data: nextAppt },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed').gte('start_at', todayStart).lte('start_at', todayEnd),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed').gte('start_at', weekStart).lte('start_at', weekEnd),
    supabase.from('conversations').select('*', { count: 'exact', head: true })
      .gte('last_message_at', sevenDaysAgo),
    supabase.from('conversations').select('unread_count'),
    supabase.from('appointments').select('services(price)')
      .in('status', ['confirmed', 'completed']).gte('start_at', weekStart).lte('start_at', weekEnd),
    supabase.from('appointments').select('services(name)')
      .eq('status', 'completed').gte('start_at', oneMonthAgo),
    supabase.from('appointments').select('*, leads(name), services(name, duration_minutes)')
      .eq('status', 'confirmed').gt('start_at', now.toISOString())
      .order('start_at').limit(1).maybeSingle(),
  ])

  const totalUnread = unreadRows?.reduce((s, c) => s + (c.unread_count ?? 0), 0) ?? 0

  const weekIncome = weekAppts?.reduce((s, a) => {
    const svc = a.services as { price: number } | null
    return s + (svc?.price ?? 0)
  }, 0) ?? 0

  const svcCounts: Record<string, number> = {}
  lastMonthAppts?.forEach((a) => {
    const name = (a.services as { name: string } | null)?.name
    if (name) svcCounts[name] = (svcCounts[name] ?? 0) + 1
  })
  const top3 = Object.entries(svcCounts).sort(([, a], [, b]) => b - a).slice(0, 3)

  const nextLead = (nextAppt?.leads as { name: string } | null)?.name
  const nextSvc = (nextAppt?.services as { name: string; duration_minutes: number } | null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turnos de hoy</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayCount ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turnos esta semana</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weekCount ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversaciones activas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeConvs ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mensajes sin leer</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUnread}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos estimados (semana)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${weekIncome.toLocaleString('es')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top servicios (último mes)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {top3.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {top3.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm truncate">{name}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximo turno</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {!nextAppt ? (
              <p className="text-sm text-muted-foreground">Sin turnos próximos</p>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold">{nextLead ?? '—'}</p>
                <p className="text-sm text-muted-foreground">{nextSvc?.name}</p>
                <p className="text-sm font-medium">
                  {format(new Date(nextAppt.start_at), "EEEE d 'de' MMMM 'a las' HH:mm'hs'", { locale: es })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
