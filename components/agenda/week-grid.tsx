'use client'

import { useState } from 'react'
import { addDays, format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tables } from '@/types/database'
import { AppointmentCard } from './appointment-card'
import { AppointmentSheet } from './appointment-sheet'

type AppointmentRow = Tables<'appointments'> & {
  leads: Tables<'leads'> | null
  services: Tables<'services'> | null
}

interface WeekGridProps {
  appointments: AppointmentRow[]
  weekStart: Date
}

export function WeekGrid({ appointments, weekStart }: WeekGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const days = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i))

  return (
    <>
      <div className="grid grid-cols-6 gap-2 min-h-64">
        {days.map((day) => {
          const dayAppts = appointments.filter((a) =>
            isSameDay(new Date(a.start_at), day)
          )
          return (
            <div key={day.toISOString()}>
              <div className="text-center mb-2 pb-2 border-b">
                <p className="text-xs text-muted-foreground capitalize">
                  {format(day, 'EEE', { locale: es })}
                </p>
                <p className="text-sm font-medium">{format(day, 'd')}</p>
              </div>
              <div className="space-y-1">
                {dayAppts.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onClick={() => setSelectedId(appt.id)}
                  />
                ))}
                {dayAppts.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">—</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <AppointmentSheet
        appointmentId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </>
  )
}
