'use client'

import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getAppointmentDetail } from '@/lib/actions/agenda'
import type { AppointmentDetail } from '@/lib/actions/agenda'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface AppointmentSheetProps {
  appointmentId: string | null
  onClose: () => void
}

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
  completed: 'Completado',
}

export function AppointmentSheet({ appointmentId, onClose }: AppointmentSheetProps) {
  const [detail, setDetail] = useState<AppointmentDetail | null>(null)

  useEffect(() => {
    if (!appointmentId) return
    getAppointmentDetail(appointmentId).then((d) => {
      setDetail(d)
    })
  }, [appointmentId])

  // True while the fetched detail doesn't match the currently requested appointment
  const isLoading = !!appointmentId && detail?.appointment.id !== appointmentId
  const appt = isLoading ? null : detail?.appointment
  const history = isLoading ? [] : (detail?.history ?? [])

  return (
    <Sheet open={!!appointmentId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalle del turno</SheetTitle>
        </SheetHeader>

        {isLoading && (
          <p className="text-sm text-muted-foreground mt-6">Cargando...</p>
        )}

        {appt && (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-medium">{appt.leads?.name ?? 'Sin nombre'}</p>
              {appt.leads?.phone && (
                <p className="text-sm text-muted-foreground">{appt.leads.phone}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Servicio</p>
              <p className="font-medium">{appt.services?.name ?? '—'}</p>
              {appt.services?.price != null && (
                <p className="text-sm text-muted-foreground">${appt.services.price}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Horario</p>
              <p className="font-medium">
                {format(new Date(appt.start_at), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
                {' — '}
                {format(new Date(appt.end_at), 'HH:mm', { locale: es })}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              <Badge variant="outline">
                {STATUS_LABELS[appt.status ?? 'pending'] ?? appt.status}
              </Badge>
            </div>

            {appt.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notas</p>
                <p className="text-sm">{appt.notes}</p>
              </div>
            )}

            {detail?.conversationId && (
              <Link
                href={`/conversaciones/${detail.conversationId}`}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-center')}
              >
                Ver conversación
              </Link>
            )}

            {history.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Turnos anteriores
                  </p>
                  <div className="space-y-2">
                    {history.map((h) => (
                      <div key={h.id} className="text-xs bg-muted rounded p-2">
                        <p className="font-medium">{h.services?.name ?? '—'}</p>
                        <p className="text-muted-foreground">
                          {format(new Date(h.start_at), "d MMM yyyy, HH:mm", { locale: es })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
