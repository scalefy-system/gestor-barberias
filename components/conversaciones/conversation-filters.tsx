'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PlatformIcon, getPlatformLabel } from '@/components/platform-icon'
import { cn } from '@/lib/utils'

const PLATFORMS = ['instagram', 'whatsapp', 'messenger', 'tiktok'] as const

export function ConversationFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get('platform') ?? ''

  function setFilter(platform: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (platform) {
      params.set('platform', platform)
    } else {
      params.delete('platform')
    }
    router.push(`/conversaciones?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setFilter('')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors',
          !active
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-border hover:bg-muted'
        )}
      >
        Todas
      </button>
      {PLATFORMS.map((platform) => (
        <button
          key={platform}
          onClick={() => setFilter(platform)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors',
            active === platform
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border hover:bg-muted'
          )}
        >
          <PlatformIcon platform={platform} size={14} withColor={active !== platform} />
          {getPlatformLabel(platform)}
        </button>
      ))}
    </div>
  )
}
