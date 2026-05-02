'use client'

import { useOptimistic, useTransition } from 'react'
import { togglePlatformConnection } from '@/lib/actions/configuracion'
import { PlatformIcon, getPlatformLabel } from '@/components/platform-icon'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Tables } from '@/types/database'

interface ConnectionCardProps {
  connection: Tables<'social_connections'>
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const [optimisticConnected, setOptimisticConnected] = useOptimistic(
    connection.is_connected ?? false,
    (_current: boolean, next: boolean) => next
  )
  const [, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      setOptimisticConnected(!optimisticConnected)
      await togglePlatformConnection(connection.platform)
    })
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <PlatformIcon platform={connection.platform} size={32} />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{getPlatformLabel(connection.platform)}</p>
          {connection.display_name && (
            <p className="text-sm text-muted-foreground truncate">
              {connection.display_name}
            </p>
          )}
          {connection.connected_at && (
            <p className="text-xs text-muted-foreground">
              Conectado{' '}
              {format(new Date(connection.connected_at), 'd MMM yyyy', { locale: es })}
            </p>
          )}
        </div>
        <Switch
          checked={optimisticConnected}
          onCheckedChange={handleToggle}
          aria-label={`Toggle ${getPlatformLabel(connection.platform)}`}
        />
      </CardContent>
    </Card>
  )
}
