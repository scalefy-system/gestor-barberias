import {
  LayoutDashboard,
  Bot,
  FileCode2,
  MessageCircle,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react";
import type { Platform, AppointmentStatus } from "@/types";

export const NAV_ITEMS = [
  { id: "dashboard",      label: "Dashboard",      icon: LayoutDashboard, href: "/dashboard" },
  { id: "agente",         label: "Agente IA",      icon: Bot,             href: "/agente", badge: "IA" },
  { id: "prompt",         label: "Prompt",         icon: FileCode2,       href: "/agente/prompt", indent: true },
  { id: "conversaciones", label: "Conversaciones", icon: MessageCircle,   href: "/conversaciones" },
  { id: "agenda",         label: "Agenda",         icon: CalendarDays,    href: "/agenda" },
  { id: "configuracion",  label: "Configuración",  icon: SlidersHorizontal, href: "/configuracion" },
] as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  tiktok: "TikTok",
  google_calendar: "Google Calendar",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  whatsapp: "#25D366",
  messenger: "#0084FF",
  tiktok: "#FAFAFA",
  google_calendar: "#4285F4",
};

export const STATUS_DOT_COLORS: Record<AppointmentStatus, string> = {
  pending: "#fbbf24",
  confirmed: "#60a5fa",
  completed: "#4ade80",
  cancelled: "#f87171",
  no_show: "#a1a1aa",
};
