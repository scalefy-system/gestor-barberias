import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface MessageBubbleProps {
  content: string
  sender: string
  sentAt: string
}

export function MessageBubble({ content, sender, sentAt }: MessageBubbleProps) {
  const isAgent = sender === 'agent'
  return (
    <div className={cn('flex', isAgent ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
          isAgent
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted rounded-tl-sm'
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isAgent ? 'text-primary-foreground/60' : 'text-muted-foreground'
          )}
        >
          {format(new Date(sentAt), 'HH:mm', { locale: es })}
        </p>
      </div>
    </div>
  )
}
