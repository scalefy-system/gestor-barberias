'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type AppointmentDetail = {
  appointment: Tables<'appointments'> & {
    leads: Tables<'leads'> | null
    services: Tables<'services'> | null
  }
  history: Array<Tables<'appointments'> & { services: Tables<'services'> | null }>
  conversationId: string | null
}

export async function getAppointmentDetail(id: string): Promise<AppointmentDetail | null> {
  const supabase = createServerClient()

  const { data: appt } = await supabase
    .from('appointments')
    .select('*, leads(*), services(*)')
    .eq('id', id)
    .maybeSingle()

  if (!appt) return null

  const leadId = appt.lead_id
  if (!leadId) return { appointment: appt, history: [], conversationId: null }

  const [{ data: history }, { data: conv }] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, services(*)')
      .eq('lead_id', leadId)
      .neq('id', id)
      .order('start_at', { ascending: false }),
    supabase
      .from('conversations')
      .select('id')
      .eq('lead_id', leadId)
      .limit(1)
      .maybeSingle(),
  ])

  return {
    appointment: appt,
    history: (history ?? []) as Array<Tables<'appointments'> & { services: Tables<'services'> | null }>,
    conversationId: conv?.id ?? null,
  }
}
