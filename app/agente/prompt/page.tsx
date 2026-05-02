import { createServerClient } from '@/lib/supabase/server'
import { PromptEditor } from '@/components/agente/prompt-editor'

export default async function PromptPage() {
  const supabase = createServerClient()
  const { data: config } = await supabase.from('ai_agent_config').select('system_prompt, updated_at').limit(1).maybeSingle()

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Editor de Prompt</h1>
      <PromptEditor
        initialPrompt={config?.system_prompt ?? ''}
        updatedAt={config?.updated_at ?? null}
      />
    </div>
  )
}
