import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tables } from '@/types/database'

type AppointmentRow = Tables<'appointments'> & {
  leads: Tables<'leads'> | null
  services: Tables<'services'> | null
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-50 border-green-300 text-green-900',
  pending: 'bg-yellow-50 border-yellow-300 text-yellow-900',
  cancelled: 'bg-red-50 border-red-300 text-red-900 line-through opacity-60',
  completed: 'bg-blue-50 border-blue-300 text-blue-900',
}

interface AppointmentCardProps {
  appointment: AppointmentRow
  onClick: () => void
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const { start_at, leads, services, status } = appointment
  const colorClass = STATUS_COLORS[status ?? 'pending'] ?? STATUS_COLORS.pending

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2 rounded border text-xs transition-opacity hover:opacity-70 ${colorClass}`}
    >
      <p className="font-medium truncate">{leads?.name ?? 'Sin nombre'}</p>
      <p className="truncate opacity-80">{services?.name ?? ''}</p>
      <p className="opacity-60">{format(new Date(start_at), 'HH:mm', { locale: es })}</p>
    </button>
  )
}
