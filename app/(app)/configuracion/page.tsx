"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plug2, Check, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { platforms as initialPlatforms } from "@/lib/mock-data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { toast } from "sonner";

export default function ConfiguracionPage() {
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [businessName, setBusinessName] = useState("Barber House");
  const [phone, setPhone] = useState("+54 9 11 5555-1234");
  const [address, setAddress] = useState("Av. Corrientes 1234, CABA");
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [reminders, setReminders] = useState(true);

  function toggle(id: string) {
    const p = platforms.find((x) => x.id === id);
    setPlatforms((prev) =>
      prev.map((pl) =>
        pl.id === id ? { ...pl, isConnected: !pl.isConnected, connectedAt: pl.isConnected ? undefined : new Date() } : pl
      )
    );
    toast.success(p?.isConnected ? "Plataforma desconectada" : "Plataforma conectada");
  }

  return (
    <PageContainer>
      <PageHeader title="Configuración" subtitle="Datos del negocio, plataformas y preferencias" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Datos del negocio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs text-muted-foreground">Nombre</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Teléfono</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Dirección</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Plataformas conectadas
              </h3>
              <Plug2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-2">
              {platforms.map((p) => (
                <motion.div
                  key={p.id}
                  variants={staggerItem}
                  className="flex items-center gap-4 rounded-md border border-border bg-secondary/30 p-3"
                >
                  <div className="h-10 w-10 rounded-md bg-card border border-border flex items-center justify-center shrink-0">
                    <PlatformIcon platform={p.id} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{p.name}</span>
                      {p.isConnected && (
                        <Badge variant="success" className="text-[10px]">
                          <Check className="h-2.5 w-2.5" /> Activo
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {p.isConnected ? p.displayName || "Conectado" : "Sin conectar"}
                    </div>
                  </div>
                  {p.isConnected ? (
                    <Button variant="ghost" size="sm" onClick={() => toggle(p.id)}>Desconectar</Button>
                  ) : (
                    <Button size="sm" onClick={() => toggle(p.id)}>
                      <ExternalLink className="h-3.5 w-3.5" />
                      Conectar
                    </Button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Preferencias del agente
            </h3>
            <div className="space-y-4">
              <Row label="Auto-confirmar turnos" desc="El agente confirma sin pedir aprobación" value={autoConfirm} onChange={setAutoConfirm} />
              <Row label="Recordatorios" desc="Enviar recordatorio 24h antes" value={reminders} onChange={setReminders} />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Plan</h3>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground mt-1">Mensajes ilimitados · Multiplataforma</p>
            <Button variant="outline" size="sm" className="w-full mt-4">Ver detalle</Button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function Row({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
