import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function fmtTime(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function fmtDateShort(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function fmtDateTime(d: Date | string) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} · ${fmtTime(dt)}`;
}

export function relTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  if (hr < 24) return `hace ${hr} h`;
  if (day === 1) return "ayer";
  if (day < 7) return `hace ${day} días`;
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}
