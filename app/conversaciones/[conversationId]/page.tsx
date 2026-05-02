import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MessageBubble } from '@/components/conversaciones/message-bubble'
import { PlatformIcon, getPlatformLabel } from '@/components/platform-icon'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const { conversationId } = await params
  const supabase = createServerClient()

  const [{ data: conv }, { data: messages }] = await Promise.all([
    supabase
      .from('conversations')
      .select('*, leads(*)')
      .eq('id', conversationId)
      .maybeSingle(),
    supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true }),
  ])

  if (!conv) notFound()

  const lead = conv.leads
  const initials =
    lead?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?'

  return (
    <div className="flex flex-col gap-4 -m-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-card sticky top-0 z-10">
        <Link
          href="/conversaciones"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{lead?.name ?? 'Sin nombre'}</span>
            <PlatformIcon platform={conv.platform} size={12} />
            <span className="text-xs text-muted-foreground">
              {getPlatformLabel(conv.platform)}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 px-6">
        {(messages ?? []).map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            sender={msg.sender}
            sentAt={msg.sent_at}
          />
        ))}
      </div>

      {/* Disabled footer */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <Input
            disabled
            placeholder="Las respuestas las maneja el agente IA"
            className="flex-1"
          />
          <Button disabled variant="outline">
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}
