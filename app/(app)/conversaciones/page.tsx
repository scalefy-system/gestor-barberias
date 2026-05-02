"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Send, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/page-shell";
import { EmptyState } from "@/components/empty-state";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { conversations, messagesByConv } from "@/lib/mock-data";
import { relTime, fmtTime, cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ConversacionesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.leadName.toLowerCase().includes(search.toLowerCase())
  );
  const active = conversations.find((c) => c.id === activeId);
  const messages = activeId ? messagesByConv[activeId] || [] : [];

  return (
    <PageContainer className="h-full flex flex-col max-w-[1400px]">
      <PageHeader title="Conversaciones" subtitle="Mensajes en curso desde todas las plataformas" />

      <Card className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] overflow-hidden min-h-[600px]">
        {/* Inbox */}
        <div className={cn("border-r border-border flex flex-col", active && "hidden md:flex")}>
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="pl-9 h-9"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium">Sin conversaciones</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                  Conectá tus plataformas para empezar a recibir mensajes.
                </p>
              </div>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="flex-1 overflow-y-auto">
              {filtered.map((c) => (
                <motion.button
                  key={c.id}
                  variants={staggerItem}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-border/50 hover:bg-secondary/40 transition-colors",
                    activeId === c.id && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                      {c.leadName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">{c.leadName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{relTime(c.lastMessageAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <PlatformIcon platform={c.platform} size={11} />
                        <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                      </div>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Chat */}
        <div className={cn("flex flex-col", !active && "hidden md:flex")}>
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <button onClick={() => setActiveId(null)} className="md:hidden text-xs text-muted-foreground">←</button>
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                  {active.leadName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{active.leadName}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <PlatformIcon platform={active.platform} size={11} />
                    Activo
                  </div>
                </div>
                <Badge variant="success" className="hidden sm:flex">
                  <Bot className="h-3 w-3" /> IA
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", m.sender === "agent" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      m.sender === "agent"
                        ? "bg-primary/90 text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    )}>
                      <div>{m.content}</div>
                      <div className="text-[10px] opacity-60 mt-0.5 text-right">{fmtTime(m.createdAt)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border p-3 flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Escribir mensaje..."
                  className="flex-1"
                />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                icon={MessageCircle}
                title="Seleccioná una conversación"
                description="Elegí un chat de la lista para ver los mensajes."
                className="border-0 bg-transparent"
              />
            </div>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
