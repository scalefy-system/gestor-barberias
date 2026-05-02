import { SiInstagram, SiWhatsapp, SiMessenger, SiTiktok, SiGooglecalendar } from "@icons-pack/react-simple-icons";
import type { Platform } from "@/types";
import { PLATFORM_COLORS } from "@/lib/constants";

const ICONS = {
  instagram: SiInstagram,
  whatsapp: SiWhatsapp,
  messenger: SiMessenger,
  tiktok: SiTiktok,
  google_calendar: SiGooglecalendar,
} as const;

export function PlatformIcon({ platform, size = 16, className }: { platform: Platform; size?: number; className?: string }) {
  const Icon = ICONS[platform];
  return <Icon size={size} color={PLATFORM_COLORS[platform]} className={className} />;
}
