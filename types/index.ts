export type Platform =
  | "instagram"
  | "whatsapp"
  | "messenger"
  | "tiktok"
  | "google_calendar";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  platform: Platform;
  createdAt: Date;
}

export interface AppointmentHistoryItem {
  id: string;
  service: string;
  date: Date;
  status: AppointmentStatus;
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  service: string;
  duration: number;
  price: number;
  datetime: Date;
  status: AppointmentStatus;
  notes?: string;
  platform: Platform;
  conversationId?: string;
  leadHistory: AppointmentHistoryItem[];
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  platform: Platform;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: "lead" | "agent";
  createdAt: Date;
}

export interface AgentConfig {
  name: string;
  personality: "professional" | "friendly" | "casual" | "formal";
  tone: "enthusiastic" | "calm" | "fun" | "serious" | "warm";
  greeting: string;
  systemPrompt: string;
  updatedAt: Date;
}

export interface PlatformConnection {
  id: Platform;
  name: string;
  displayName?: string;
  isConnected: boolean;
  connectedAt?: Date;
}

export interface DashboardMetrics {
  appointmentsToday: number;
  appointmentsWeek: number;
  activeConversations: number;
  unreadMessages: number;
  estimatedWeeklyRevenue: number;
  topServices: { name: string; count: number }[];
  nextAppointment?: Appointment;
}

export interface AuthUser {
  email: string;
  name: string;
}
