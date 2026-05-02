# Barbería Capital — Sistema de Gestión

Demo de sistema de gestión para barberías con agente IA integrado.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Base de datos:** Supabase (PostgreSQL)
- **UI:** Shadcn UI + Tailwind CSS v4
- **Lenguaje:** TypeScript (strict)
- **Íconos:** Lucide + Simple Icons

## Funcionalidades

- **Dashboard** — Métricas en tiempo real: turnos de hoy, leads activos, conversaciones, tasa de conversión
- **Conversaciones** — Bandeja multicanal (Instagram, WhatsApp, Messenger, TikTok) con filtrado por plataforma
- **Agenda** — Vista semanal de turnos (Lun–Sáb) con navegación y detalle en sheet lateral
- **Agente IA** — Configuración del bot: nombre, personalidad, tono, saludo y prompt personalizado
- **Configuración** — Activar/desactivar conexiones a plataformas sociales con toggle optimista

## Setup local

### 1. Clonar e instalar

```bash
git clone <repo>
cd gestor-barberias
npm install
```

### 2. Variables de entorno

Copiar `.env.example` a `.env.local` y completar los valores:

```bash
cp .env.example .env.local
```

| Variable | Dónde obtenerla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |

### 3. Base de datos

Ejecutar las migraciones SQL en el proyecto de Supabase y luego correr el seed de datos demo.

### 4. Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Importar el repo en [vercel.com](https://vercel.com)
2. Agregar las 3 variables de entorno en Settings → Environment Variables
3. Deploy automático en cada push a `main`

## Estructura

```
app/
  dashboard/        # Métricas de negocio
  conversaciones/   # Lista y chat individual por plataforma
  agenda/           # Vista semanal de turnos
  agente/           # Configuración del agente IA y prompt
  configuracion/    # Conexiones a plataformas sociales
components/
  conversaciones/   # Filtros y burbujas de mensaje
  agenda/           # Grid semanal, tarjetas y sheet de detalle
  agente/           # Wizard y editor de prompt
  configuracion/    # Tarjeta de conexión con toggle
  ui/               # Componentes base (Shadcn)
lib/
  supabase/         # Clientes server y client
  actions/          # Server actions (agente, agenda, configuración)
types/
  database.ts       # Tipos generados desde Supabase schema
```
