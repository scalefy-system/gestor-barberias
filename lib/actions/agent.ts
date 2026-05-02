'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

const configSchema = z.object({
  agent_name: z.string().min(1),
  personality: z.enum(['formal', 'casual', 'amigable', 'profesional']),
  tone: z.enum(['entusiasta', 'calmo', 'divertido', 'serio', 'cercano']),
  greeting: z.string().min(1),
})

export async function updateAgentConfig(data: unknown): Promise<{ error?: string }> {
  const parsed = configSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos' }

  const supabase = createServerClient()
  const { data: cfg } = await supabase.from('ai_agent_config').select('id').limit(1).maybeSingle()
  if (!cfg) return { error: 'Config no encontrada' }

  const { error } = await supabase
    .from('ai_agent_config')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', cfg.id)

  if (error) return { error: error.message }
  revalidatePath('/agente')
  return {}
}

export async function updateAgentPrompt(prompt: string): Promise<{ error?: string }> {
  if (!prompt.trim()) return { error: 'El prompt no puede estar vacío' }

  const supabase = createServerClient()
  const { data: cfg } = await supabase.from('ai_agent_config').select('id').limit(1).maybeSingle()
  if (!cfg) return { error: 'Config no encontrada' }

  const { error } = await supabase
    .from('ai_agent_config')
    .update({ system_prompt: prompt, updated_at: new Date().toISOString() })
    .eq('id', cfg.id)

  if (error) return { error: error.message }
  revalidatePath('/agente/prompt')
  return {}
}

export const DEFAULT_PROMPT = `Sos Capi, el asistente virtual de Barbería Capital, ubicada en Av. 18 de Julio 1520, Montevideo, Uruguay.

Tu rol es atender consultas de clientes por redes sociales de manera amigable y profesional. Respondés siempre en español rioplatense.

SERVICIOS:
- Corte clásico: $600 (30 min)
- Corte degradado: $800 (45 min)
- Barba: $400 (20 min)
- Corte + barba: $1100 (60 min)
- Arreglo de cejas: $200 (15 min)
- Tinte: $1500 (60 min)

HORARIOS: Lunes a viernes 9-20hs, Sábados 9-17hs, Domingos cerrado.

PAUTAS: Mensajes cortos y directos. Confirmá servicio, día y hora al agendar. Ofrecé alternativas si no hay disponibilidad. Tono amigable pero profesional.`
