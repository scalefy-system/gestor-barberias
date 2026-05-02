import { createServerClient } from '@/lib/supabase/server'
import { AgentWizard } from '@/components/agente/wizard'

export default async function AgentePage() {
  const supabase = createServerClient()
  const { data: config } = await supabase.from('ai_agent_config').select('*').limit(1).maybeSingle()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Configuración del Agente IA</h1>
      <AgentWizard config={config} />
    </div>
  )
}
