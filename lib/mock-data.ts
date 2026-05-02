import type {
  Appointment,
  Conversation,
  Message,
  PlatformConnection,
  DashboardMetrics,
} from "@/types";

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const dow = today.getDay();
const mondayOffset = dow === 0 ? -6 : 1 - dow;

export const SERVICES = [
  { name: "Corte clásico", price: 2500, duration: 30 },
  { name: "Corte + barba", price: 3800, duration: 45 },
  { name: "Degradé", price: 3200, duration: 40 },
  { name: "Diseño de barba", price: 2000, duration: 25 },
  { name: "Tratamiento capilar", price: 4500, duration: 60 },
];

export const conversations: Conversation[] = [];
export const messagesByConv: Record<string, Message[]> = {};
export const appointments: Appointment[] = [];

export const weekDays = (["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const).map(
  (dn, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + idx);
    return {
      dayName: dn,
      dayNumber: d.getDate(),
      date: d,
      isToday: d.toDateString() === today.toDateString(),
      appointments: [] as Appointment[],
    };
  }
);

export const platforms: PlatformConnection[] = [
  { id: "instagram", name: "Instagram", displayName: "", isConnected: false },
  { id: "whatsapp", name: "WhatsApp Business", displayName: "", isConnected: false },
  { id: "messenger", name: "Messenger", displayName: "", isConnected: false },
  { id: "tiktok", name: "TikTok", displayName: "", isConnected: false },
  { id: "google_calendar", name: "Google Calendar", displayName: "", isConnected: false },
];

export const metrics: DashboardMetrics = {
  appointmentsToday: 0,
  appointmentsWeek: 0,
  activeConversations: 0,
  unreadMessages: 0,
  estimatedWeeklyRevenue: 0,
  topServices: [],
  nextAppointment: undefined,
};

export function weekRangeLabel() {
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const start = weekDays[0].date;
  const end = weekDays[5].date;
  return `${start.getDate()} ${months[start.getMonth()]} — ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
}

export const DEFAULT_PROMPT = `Eres Lucas, el asistente virtual de Barber House — una barbería ubicada en Buenos Aires, Argentina.

# Contexto del negocio
- Atendemos de lunes a sábado, de 9:00 a 20:00.
- Servicios disponibles:
  • Corte clásico — $2.500 (30 min)
  • Corte + barba — $3.800 (45 min)
  • Degradé — $3.200 (40 min)
  • Diseño de barba — $2.000 (25 min)
  • Tratamiento capilar — $4.500 (60 min)
- Aceptamos efectivo y transferencia bancaria. No tenemos posnet.

# Tono y estilo
- Hablás en español rioplatense, de manera cercana y amigable.
- Usás "vos" en lugar de "tú".
- Sos breve y vas al grano. Evitás respuestas largas.
- Podés usar 1 emoji puntualmente, nunca varios seguidos.

# Lo que tenés que hacer
1. Saludar al cliente por su nombre si lo conocés.
2. Entender qué servicio necesita.
3. Ofrecer 2-3 opciones de horario disponibles.
4. Confirmar la reserva una vez que el cliente elija.
5. Informar el precio y los medios de pago aceptados.

# Lo que NO tenés que hacer
- No prometas servicios que no están en la lista.
- No reserves turnos fuera del horario de atención.
- No respondas preguntas que no sean sobre la barbería.
- Si el cliente pide algo fuera de tu alcance, derivar al dueño con: "Te paso con Diego para que te ayude con eso."`;
