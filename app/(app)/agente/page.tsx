"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Check, ChevronLeft, ChevronRight, FileCode2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { slideVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Identidad", "Personalidad", "Saludo", "Resumen"] as const;

const PERSONALITIES = [
  { id: "professional", label: "Profesional", desc: "Educado y eficiente" },
  { id: "friendly",     label: "Amigable",    desc: "Cercano y cálido" },
  { id: "casual",       label: "Casual",      desc: "Distendido, jerga argentina" },
  { id: "formal",       label: "Formal",      desc: "Cortés y preciso" },
] as const;

const TONES = [
  { id: "enthusiastic", label: "Entusiasta" },
  { id: "calm",         label: "Calmado" },
  { id: "fun",          label: "Divertido" },
  { id: "serious",      label: "Serio" },
  { id: "warm",         label: "Cálido" },
] as const;

export default function AgentePage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("Lucas");
  const [personality, setPersonality] = useState<string>("friendly");
  const [tone, setTone] = useState<string>("warm");
  const [greeting, setGreeting] = useState("¡Hola! Soy Lucas de Barber House. ¿En qué te puedo ayudar?");

  function next() { setDir(1); setStep((s) => Math.min(STEPS.length - 1, s + 1)); }
  function prev() { setDir(-1); setStep((s) => Math.max(0, s - 1)); }
  function save() { toast.success("Agente IA configurado"); }

  return (
    <PageContainer>
      <PageHeader
        title="Agente IA"
        subtitle="Configurá la personalidad y comportamiento de tu asistente"
        actions={
          <Button render={<Link href="/agente/prompt" />} variant="outline" size="sm">
            <FileCode2 className="h-4 w-4" />
            Editar prompt
          </Button>
        }
      />

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-colors",
                done ? "bg-primary text-primary-foreground" :
                active ? "bg-primary/15 text-primary border border-primary" :
                "bg-secondary text-muted-foreground"
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn("text-xs hidden sm:block", active ? "text-foreground font-medium" : "text-muted-foreground")}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className={cn("flex-1 h-px", done ? "bg-primary" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="relative min-h-[420px]">
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8"
            >
              {step === 0 && (
                <div className="space-y-6 max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Identidad</h2>
                      <p className="text-xs text-muted-foreground">¿Cómo se llama tu agente?</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">Nombre del agente</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lucas" />
                    <p className="text-[11px] text-muted-foreground">
                      Tip: un nombre humano genera más confianza que &ldquo;Bot&rdquo; o &ldquo;Asistente&rdquo;.
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Personalidad y tono</h2>
                      <p className="text-xs text-muted-foreground">Cómo se expresa con tus clientes</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Personalidad</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PERSONALITIES.map((p) => {
                        const active = personality === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setPersonality(p.id)}
                            className={cn(
                              "rounded-md border p-3 text-left transition-all",
                              active ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/50"
                            )}
                          >
                            <div className="text-sm font-medium flex items-center gap-2">
                              {p.label}
                              {active && <Check className="h-3.5 w-3.5 text-primary" />}
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Tono</label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => {
                        const active = tone === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTone(t.id)}
                            className={cn(
                              "rounded-md border px-3 py-1.5 text-sm transition-all",
                              active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary/50"
                            )}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <h2 className="text-lg font-semibold">Mensaje de bienvenida</h2>
                    <p className="text-xs text-muted-foreground">Lo primero que verá un cliente al escribirte.</p>
                  </div>
                  <Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} rows={4} placeholder="¡Hola! Soy..." />
                  <Card className="p-4 bg-secondary/30 border-dashed">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Vista previa</div>
                    <div className="flex items-start gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="rounded-lg rounded-tl-sm bg-card px-3 py-2 text-sm border border-border">
                        {greeting || <span className="text-muted-foreground italic">El saludo aparecerá acá</span>}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Resumen</h2>
                    <p className="text-xs text-muted-foreground">Revisá la configuración antes de guardar.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Nombre", value: name },
                      { label: "Personalidad", value: PERSONALITIES.find(p => p.id === personality)?.label },
                      { label: "Tono", value: TONES.find(t => t.id === tone)?.label },
                      { label: "Estado", value: <Badge variant="success">Activo</Badge> },
                    ].map((row) => (
                      <div key={row.label} className="rounded-md border border-border bg-secondary/30 p-3">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{row.label}</div>
                        <div className="text-sm font-medium mt-1">{row.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-border bg-secondary/30 p-4">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Saludo</div>
                    <p className="text-sm">{greeting}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> Atrás
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Siguiente <ChevronRight className="h-4 w-4" /></Button>
          ) : (
            <Button onClick={save}><Check className="h-4 w-4" /> Guardar agente</Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
