import React from 'react'
import {
  SiInstagram,
  SiWhatsapp,
  SiMessenger,
  SiTiktok,
  SiGooglecalendar,
} from '@icons-pack/react-simple-icons'

type PlatformKey = 'instagram' | 'whatsapp' | 'messenger' | 'tiktok' | 'google_calendar'

interface IconEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>
  color: string
  label: string
}

const ICON_MAP: Record<PlatformKey, IconEntry> = {
  instagram:       { Icon: SiInstagram,       color: '#E1306C', label: 'Instagram' },
  whatsapp:        { Icon: SiWhatsapp,         color: '#25D366', label: 'WhatsApp' },
  messenger:       { Icon: SiMessenger,        color: '#0084FF', label: 'Messenger' },
  tiktok:          { Icon: SiTiktok,           color: '#010101', label: 'TikTok' },
  google_calendar: { Icon: SiGooglecalendar,   color: '#4285F4', label: 'Google Calendar' },
}

function isPlatformKey(p: string): p is PlatformKey {
  return p in ICON_MAP
}

interface PlatformIconProps {
  platform: string
  size?: number
  withColor?: boolean
  className?: string
}

export function PlatformIcon({ platform, size = 16, withColor = true, className }: PlatformIconProps) {
  if (!isPlatformKey(platform)) return null
  const { Icon, color, label } = ICON_MAP[platform]
  return <Icon size={size} color={withColor ? color : undefined} title={label} className={className} />
}

export function getPlatformLabel(platform: string): string {
  if (!isPlatformKey(platform)) return platform
  return ICON_MAP[platform].label
}
