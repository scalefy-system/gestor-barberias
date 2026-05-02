'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

export async function togglePlatformConnection(platform: string): Promise<{ error?: string }> {
  const supabase = createServerClient()

  const { data: conn } = await supabase
    .from('social_connections')
    .select('id, is_connected')
    .eq('platform', platform)
    .maybeSingle()

  if (!conn) return { error: 'Plataforma no encontrada' }

  const { error } = await supabase
    .from('social_connections')
    .update({ is_connected: !conn.is_connected })
    .eq('id', conn.id)

  if (error) return { error: error.message }
  revalidatePath('/configuracion')
  return {}
}
