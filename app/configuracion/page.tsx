import { createServerClient } from '@/lib/supabase/server'
import { ConnectionCard } from '@/components/configuracion/connection-card'

export default async function ConfiguracionPage() {
  const supabase = createServerClient()

  const { data: connections } = await supabase
    .from('social_connections')
    .select('*')
    .order('platform')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Administrá las plataformas conectadas a tu barbería.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(connections ?? []).map((conn) => (
          <ConnectionCard key={conn.id} connection={conn} />
        ))}
      </div>
    </div>
  )
}
