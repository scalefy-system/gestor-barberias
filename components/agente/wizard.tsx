'use client'

import { useState, useTransition } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { updateAgentConfig } from '@/lib/actions/agent'
import type { Tables } from '@/types/database'

type Config = Tables<'ai_agent_config'>

export function AgentWizard({ config }: { config: Config | null }) {
  const [name, setName] = useState(config?.agent_name ?? 'Asistente')
  const [personality, setPersonality] = useState(config?.personality ?? 'amigable')
  const [tone, setTone] = useState(config?.tone ?? 'cercano')
  const [greeting, setGreeting] = useState(config?.greeting ?? '')
  const [tab, setTab] = useState('nombre')
  const [status, setStatus] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSave() {
    startTransition(async () => {
      const result = await updateAgentConfig({ agent_name: name, personality, tone, greeting })
      setStatus(result.error ? `Error: ${result.error}` : '¡Guardado correctamente!')
    })
  }

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="nombre">Nombre</TabsTrigger>
        <TabsTrigger value="personalidad">Personalidad</TabsTrigger>
        <TabsTrigger value="tono">Tono</TabsTrigger>
        <TabsTrigger value="saludo">Saludo</TabsTrigger>
        <TabsTrigger value="resumen">Guardar</TabsTrigger>
      </TabsList>

      <TabsContent value="nombre" className="space-y-4 mt-4">
        <Label htmlFor="agent-name">Nombre del agente</Label>
        <Input id="agent-name" value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={() => setTab('personalidad')}>Siguiente</Button>
      </TabsContent>

      <TabsContent value="personalidad" className="space-y-4 mt-4">
        <Label>Personalidad</Label>
        <Select value={personality} onValueChange={(v) => { if (v) setPersonality(v) }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">Formal</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="amigable">Amigable</SelectItem>
            <SelectItem value="profesional">Profesional</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setTab('tono')}>Siguiente</Button>
      </TabsContent>

      <TabsContent value="tono" className="space-y-4 mt-4">
        <Label>Tono</Label>
        <Select value={tone} onValueChange={(v) => { if (v) setTone(v) }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="entusiasta">Entusiasta</SelectItem>
            <SelectItem value="calmo">Calmo</SelectItem>
            <SelectItem value="divertido">Divertido</SelectItem>
            <SelectItem value="serio">Serio</SelectItem>
            <SelectItem value="cercano">Cercano</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setTab('saludo')}>Siguiente</Button>
      </TabsContent>

      <TabsContent value="saludo" className="space-y-4 mt-4">
        <Label htmlFor="greeting">Saludo personalizado</Label>
        <Textarea id="greeting" value={greeting} onChange={e => setGreeting(e.target.value)} rows={3} />
        <Button onClick={() => setTab('resumen')}>Siguiente</Button>
      </TabsContent>

      <TabsContent value="resumen" className="space-y-4 mt-4">
        <Card>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div><span className="font-medium">Nombre:</span> {name}</div>
            <div><span className="font-medium">Personalidad:</span> {personality}</div>
            <div><span className="font-medium">Tono:</span> {tone}</div>
            <div><span className="font-medium">Saludo:</span> {greeting}</div>
          </CardContent>
        </Card>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar configuración'}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
