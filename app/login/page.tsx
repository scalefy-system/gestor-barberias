"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scissors, Loader2, Bot, MessageCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, getStoredUser } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getStoredUser()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Bienvenido a Barber House");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al iniciar sesión");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("diego@barberhouse.com.ar");
    setPassword("demo1234");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight">Barber House</div>
              <div className="text-[11px] text-muted-foreground tracking-wider uppercase">Panel admin</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-8">
            Ingresá a tu panel para gestionar turnos y conversaciones.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="diego@barberhouse.com.ar"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Usar credenciales demo
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
            <p>¿No tenés cuenta? <span className="text-primary cursor-pointer">Contactá al admin</span></p>
          </div>
        </motion.div>
      </div>

      {/* Visual side */}
      <div className="hidden lg:flex relative overflow-hidden bg-card border-l border-border items-center justify-center p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-700/5" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-amber-700/10 blur-3xl" />

        <div className="relative z-10 max-w-md space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              Tu agente IA atendiendo turnos<br />
              <span className="text-primary">24/7</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Centralizá WhatsApp, Instagram y Messenger en un solo lugar. Tu IA responde, agenda y confirma.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-lg border border-border bg-background/60 backdrop-blur p-4 space-y-3"
          >
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="rounded-lg rounded-tl-sm bg-secondary/60 px-3 py-2 text-sm">
                Hola! Tengo turno para mañana 16:30 corte + barba. ¿Te sirve?
              </div>
            </div>
            <div className="flex items-start gap-2.5 flex-row-reverse">
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">M</div>
              <div className="rounded-lg rounded-tr-sm bg-primary/90 text-primary-foreground px-3 py-2 text-sm">
                Perfecto, confirmo
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { icon: MessageCircle, label: "Mensajes", value: "1.2k" },
              { icon: CalendarDays, label: "Turnos/mes", value: "320" },
              { icon: Bot, label: "Disponible", value: "24/7" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-border bg-background/60 p-3 text-center">
                <s.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                <div className="text-base font-bold leading-none">{s.value}</div>
                <div className="text-[10px] text-muted-foreground tracking-wider uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
