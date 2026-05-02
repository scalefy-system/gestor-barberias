'use client'

import { useState, useTransition } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateAgentPrompt, DEFAULT_PROMPT } from '@/lib/actions/agent'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function PromptEditor({ initialPrompt, updatedAt }: { initialPrompt: string; updatedAt: string | null }) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [status, setStatus] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSave() {
    startTransition(async () => {
      const result = await updateAgentPrompt(prompt)
      setStatus(result.error ? `Error: ${result.error}` : '¡Guardado correctamente!')
    })
  }

  return (
    <div className="space-y-4">
      {updatedAt && (
        <p className="text-sm text-muted-foreground">
          Última actualización: {formatDistanceToNow(new Date(updatedAt), { addSuffix: true, locale: es })}
        </p>
      )}
      <Textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="min-h-96 font-mono text-sm"
        placeholder="Escribí el prompt del agente..."
      />
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button variant="outline" onClick={() => { setPrompt(DEFAULT_PROMPT); setStatus('') }}>
          Restaurar default
        </Button>
      </div>
    </div>
  )
}
