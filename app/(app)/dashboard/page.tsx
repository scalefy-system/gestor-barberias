"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MessageCircle, TrendingUp, Sparkles, ArrowRight, Bot, SlidersHorizontal, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { metrics } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de tu barbería en tiempo real"
        actions={
          <Button render={<Link href="/agenda" />} variant="outline" size="sm">
            <CalendarDays className="h-4 w-4" />
            Ver agenda
          </Button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 mb-6"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">¡Bienvenido a Barber House!</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Configurá tu agente IA y conectá tus plataformas para empezar a recibir turnos automáticamente.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button render={<Link href="/agente" />}>
              <Bot className="h-4 w-4" />
              Configurar agente IA
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button render={<Link href="/configuracion" />} variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
              Conectar plataformas
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          { icon: CalendarDays, label: "Turnos hoy", value: metrics.appointmentsToday, hint: "Sin turnos programados" },
          { icon: TrendingUp, label: "Esta semana", value: metrics.appointmentsWeek, hint: "Sin actividad" },
          { icon: MessageCircle, label: "Conversaciones", value: metrics.activeConversations, hint: "Sin mensajes" },
          { icon: Zap, label: "Ingresos est.", value: `$${metrics.estimatedWeeklyRevenue.toLocaleString("es-AR")}`, hint: "—" },
        ].map((m) => (
          <motion.div key={m.label} variants={staggerItem}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</span>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{m.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{m.hint}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Próximos turnos</h3>
            <Link href="/agenda" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
            <CalendarDays className="h-8 w-8 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium">Sin turnos próximos</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Cuando tu agente IA agende turnos, vas a verlos acá.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Servicios top</h3>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <TrendingUp className="h-7 w-7 text-muted-foreground/50 mb-3" />
            <p className="text-xs text-muted-foreground">Sin datos suficientes</p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
