import { createServerClient } from '@/lib/supabase/server'
import { ConversationFilters } from '@/components/conversaciones/conversation-filters'
import { PlatformIcon } from '@/components/platform-icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default async function ConversacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string }>
}) {
  const { platform } = await searchParams
  const supabase = createServerClient()

  const convQuery = supabase
    .from('conversations')
    .select('*, leads(*)')
    .order('last_message_at', { ascending: false })

  const { data: conversations } = platform
    ? await convQuery.eq('platform', platform)
    : await convQuery

  const convIds = (conversations ?? []).map((c) => c.id)

  const { data: lastMessages } =
    convIds.length > 0
      ? await supabase
          .from('messages')
          .select('conversation_id, content, sent_at, sender')
          .in('conversation_id', convIds)
          .order('sent_at', { ascending: false })
      : { data: [] }

  const lastMsgMap = new Map<string, { content: string; sent_at: string }>()
  for (const msg of lastMessages ?? []) {
    if (msg.conversation_id && !lastMsgMap.has(msg.conversation_id)) {
      lastMsgMap.set(msg.conversation_id, { content: msg.content, sent_at: msg.sent_at })
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Conversaciones</h1>
      <ConversationFilters />
      <div className="space-y-2">
        {(conversations ?? []).map((conv) => {
          const lastMsg = lastMsgMap.get(conv.id)
          const lead = conv.leads
          const initials =
            lead?.name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) ?? '?'
          return (
            <Link
              key={conv.id}
              href={`/conversaciones/${conv.id}`}
              className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{lead?.name ?? 'Sin nombre'}</span>
                  <PlatformIcon platform={conv.platform} size={12} />
                  {(conv.unread_count ?? 0) > 0 && (
                    <Badge className="text-xs px-1.5 py-0">{conv.unread_count}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {lastMsg?.content ?? ''}
                </p>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {conv.last_message_at
                  ? formatDistanceToNow(new Date(conv.last_message_at), {
                      addSuffix: true,
                      locale: es,
                    })
                  : ''}
              </div>
            </Link>
          )
        })}
        {(conversations ?? []).length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hay conversaciones</p>
        )}
      </div>
    </div>
  )
}
