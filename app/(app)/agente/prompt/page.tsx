"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode2, RotateCcw, Save, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { DEFAULT_PROMPT } from "@/lib/mock-data";
import { toast } from "sonner";

export default function PromptPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [showPreview, setShowPreview] = useState(false);
  const wordCount = prompt.trim().split(/\s+/).filter(Boolean).length;
  const charCount = prompt.length;

  function reset() { setPrompt(DEFAULT_PROMPT); toast.info("Prompt restaurado al template"); }
  function save() { toast.success("Prompt guardado"); }

  return (
    <PageContainer>
      <PageHeader
        title="Prompt"
        subtitle="Editor del system prompt — controla cómo se comporta tu agente"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4" />
              {showPreview ? "Editor" : "Preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Restaurar
            </Button>
            <Button size="sm" onClick={save}>
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">system_prompt.md</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>{wordCount} palabras</span>
                <span>·</span>
                <span>{charCount} chars</span>
              </div>
            </div>
            {showPreview ? (
              <div className="p-6 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-foreground/90 max-h-[600px] overflow-y-auto">
                {prompt}
              </div>
            ) : (
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={28}
                className="font-mono text-[13px] leading-relaxed border-0 rounded-none bg-card focus-visible:ring-0"
              />
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Buenas prácticas</h3>
            <ul className="text-xs text-muted-foreground space-y-2.5">
              <li className="flex gap-2"><span className="text-primary">•</span> Definí contexto del negocio: horarios, servicios, precios.</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Especificá el tono de voz claro y consistente.</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Listá lo que NO debe hacer el agente.</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Usá ejemplos concretos cuando sea posible.</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Definí un fallback si no puede responder.</li>
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-3">Variables disponibles</h3>
            <div className="space-y-2">
              {["{{nombre_cliente}}", "{{horario_actual}}", "{{servicios_disponibles}}", "{{proximo_turno_libre}}"].map((v) => (
                <code key={v} className="block text-[11px] font-mono bg-secondary/60 rounded px-2 py-1 text-primary">
                  {v}
                </code>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Estado</h3>
              <Badge variant="success">Activo</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">Última actualización: ahora mismo</p>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}
