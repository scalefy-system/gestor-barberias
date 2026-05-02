"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { EmptyState } from "@/components/empty-state";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { weekDays, weekRangeLabel } from "@/lib/mock-data";
import { fmtTime, fmtDateTime, cn } from "@/lib/utils";
import { STATUS_DOT_COLORS } from "@/lib/constants";
import type { Appointment, AppointmentStatus } from "@/types";
import { staggerContainer, staggerItem } from "@/lib/animations";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
  no_show: "No asistió",
};

export default function AgendaPage() {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const totalAppts = weekDays.reduce((acc, d) => acc + d.appointments.length, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Agenda"
        subtitle={`Semana del ${weekRangeLabel()}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="icon" aria-label="Semana anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Siguiente semana">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Nuevo turno
            </Button>
          </div>
        }
      />

      {totalAppts === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Sin turnos esta semana"
          description="Cuando tu agente IA confirme turnos, vas a verlos acá organizados por día."
          action={<Button size="sm"><Plus className="h-4 w-4" />Crear turno manual</Button>}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {weekDays.map((day) => (
            <motion.div key={day.dayName} variants={staggerItem}>
              <Card className={cn("p-3 h-full min-h-[400px]", day.isToday && "border-primary/40 bg-primary/5")}>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <div className={cn("text-[10px] uppercase tracking-wider font-bold", day.isToday ? "text-primary" : "text-muted-foreground")}>
                      {day.dayName}
                    </div>
                    <div className={cn("text-2xl font-bold leading-none", day.isToday && "text-primary")}>
                      {day.dayNumber}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{day.appointments.length}</span>
                </div>
                <div className="space-y-1.5">
                  {day.appointments.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="w-full text-left rounded-md border border-border bg-card hover:border-primary/40 hover:bg-secondary/40 transition-colors p-2"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_DOT_COLORS[a.status] }} />
                        <span className="text-[11px] font-mono font-semibold">{fmtTime(a.datetime)}</span>
                      </div>
                      <div className="text-xs font-medium truncate">{a.leadName}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{a.service}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-y-auto">
          {selected && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <SheetHeader>
                  <SheetTitle>Detalle del turno</SheetTitle>
                </SheetHeader>
                <Card className="p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cliente</div>
                  <div className="text-base font-semibold">{selected.leadName}</div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <PlatformIcon platform={selected.platform} size={12} />
                    Vino por {selected.platform}
                  </div>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Servicio</div>
                    <div className="text-sm font-medium mt-1">{selected.service}</div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Precio</div>
                    <div className="text-sm font-medium mt-1">${selected.price.toLocaleString("es-AR")}</div>
                  </Card>
                  <Card className="p-3 col-span-2">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cuándo</div>
                    <div className="text-sm font-medium mt-1 capitalize">{fmtDateTime(selected.datetime)}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{selected.duration} min</div>
                  </Card>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Estado</div>
                  <Badge>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_DOT_COLORS[selected.status] }} />
                    {STATUS_LABEL[selected.status]}
                  </Badge>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">Reprogramar</Button>
                  <Button variant="destructive" className="flex-1">Cancelar</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </SheetContent>
      </Sheet>
    </PageContainer>
  );
}
