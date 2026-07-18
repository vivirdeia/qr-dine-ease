# CARTA: Digital Menu & Bookings

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=radix-ui&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

Micro SaaS para restaurantes que permite publicar cartas digitales personalizables accesibles por QR, gestionar reservas y mesas, y administrar todo desde un panel unificado. Cada restaurante dispone de branding propio (paletas de colores), integración con Google Maps y módulos activables (reservas, mesas, botón de reservar en QR).

Producción: https://qr-dine-ease.lovable.app

## Remix este proyecto

Este proyecto es público y está preparado para remixear con un clic desde Lovable. Al remixearlo obtienes una copia independiente con:

- Landing completa (hero, características, comparativa, precios, FAQs y footer legal).
- Carta pública multi-idioma accesible por QR, con modal de detalle de plato y tracking de vistas.
- Panel de administración multi-tenant con roles (superadmin, owner, staff), CRUD de categorías, platos, vinos, mesas y reservas.
- Datos de demo persistidos en `localStorage` del navegador, listos para explorar sin configurar nada.

Pasos recomendados tras remixear:

1. Pulsa "Remix" en Lovable para crear tu copia y ábrela en el editor.
2. Opcional: conecta tu propio proyecto Supabase copiando `.env.example` a `.env` y rellenando `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Si prefieres seguir en modo demo con `localStorage`, sáltate este paso.
3. Personaliza el branding del restaurante desde el Dashboard (paleta de colores, logo, datos de contacto, módulos activos y zonas de reserva) y edita `src/config/company.ts` para sustituir los datos legales (razón social, CIF/NIF, dirección, jurisdicción y emails) que aparecen en el footer y en las páginas legales.
4. Publica desde Lovable pulsando "Publish" y, si quieres, conecta un dominio propio en Project Settings.

## Características principales

- Carta pública mobile-first accesible por QR, sin necesidad de instalar app.
- Panel de administración por restaurante (owner y staff) con CRUD de categorías, platos, vinos, mesas y reservas.
- Panel de superadministración global para gestionar tenants y usuarios.
- Sistema multi-tenant con roles: superadmin, owner, staff.
- Personalización de marca por restaurante: paleta de colores, logo y datos de contacto.
- Módulo de reservas configurable con zonas personalizables y toggle para ocultar el botón cuando se accede desde el QR de mesa.
- Multi-idioma en la carta pública (ES, EN, FR, CA).
- Banner de cookies con consentimiento GDPR y gating de scripts de tracking (Google Analytics, Meta Pixel).
- Modal de detalle de plato con tracking de vistas para métricas.
- Integración con Google Maps para mostrar la ubicación del restaurante.
- Páginas legales completas (privacidad, términos, cookies, GDPR) e informativas (características, precios, demo, ayuda, guías, contacto).

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Build | Vite 5 |
| UI | React 18 + TypeScript 5 |
| Estilos | Tailwind CSS 3 + shadcn/ui + Radix UI |
| Routing | React Router 6 |
| Estado servidor | TanStack Query |
| Animaciones | Framer Motion |
| Backend | Supabase (auth, base de datos, storage) |
| Formularios | React Hook Form + Zod |
| Tests unitarios | Vitest + Testing Library |
| Tests E2E | Playwright |
| Lint | ESLint 9 + typescript-eslint |

## Requisitos previos

- Node.js 18 o superior.
- npm, pnpm o bun.
- Cuenta de Supabase si se quiere trabajar contra un proyecto propio.

## Instalación local

```bash
git clone <url-del-repo>
cd <carpeta-del-repo>
npm install
cp .env.example .env   # opcional, solo si vas a usar tu propio Supabase
npm run dev
```

La app queda disponible en `http://localhost:8080`.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Arranca el servidor de desarrollo de Vite. |
| `npm run build` | Genera el build de producción en `dist/`. |
| `npm run build:dev` | Build en modo desarrollo (útil para depurar). |
| `npm run preview` | Sirve localmente el build de producción. |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto. |
| `npm run test` | Ejecuta la suite de Vitest una sola vez. |
| `npm run test:watch` | Ejecuta Vitest en modo watch. |
| `npx playwright test` | Ejecuta los tests end to end de Playwright. |

## Estructura del proyecto

```text
.
├── public/                     Archivos estáticos servidos tal cual
├── src/
│   ├── pages/                  Páginas de nivel superior por ruta
│   │   ├── info/               Páginas informativas (pricing, demo, ayuda...)
│   │   └── legal/              Páginas legales (privacidad, cookies, GDPR...)
│   ├── components/             Componentes reutilizables de UI
│   │   ├── landing/            Bloques específicos de la landing
│   │   ├── public/             Componentes de la carta pública (DishModal, LocationMap)
│   │   └── ui/                 Wrappers de shadcn/ui
│   ├── context/                AppContext con la lógica multi-tenant
│   ├── data/                   Datos mock, imágenes y traducciones
│   ├── hooks/                  Hooks compartidos (useLocalStorage, useCookieConsent...)
│   ├── integrations/supabase/  Cliente Supabase y tipos generados
│   ├── lib/                    Utilidades
│   └── test/                   Setup de Vitest y ejemplos
├── supabase/                   Configuración local de Supabase
├── playwright.config.ts        Configuración de Playwright
├── vitest.config.ts            Configuración de Vitest
├── tailwind.config.ts          Configuración de Tailwind
└── vite.config.ts              Configuración de Vite
```

## Variables de entorno

El cliente Supabase se configura en `src/integrations/supabase/client.ts`. Los valores publicables (URL y anon key) se pueden dejar en el código, pero para trabajar con un proyecto propio se recomienda usar variables de entorno. Consulta `.env.example` como plantilla.

Nunca subir claves privadas (service role) al repositorio.

## Despliegue

El proyecto se publica desde el editor de Lovable, que hospeda automáticamente el build en `https://qr-dine-ease.lovable.app`. Los cambios frontales requieren pulsar "Publish" para pasar a producción. Al estar vinculado con GitHub, los commits se sincronizan de forma bidireccional.

Para desplegar en otro hosting basta con generar el build estático:

```bash
npm run build
```

Y servir el contenido de `dist/` en cualquier CDN o hosting estático (Vercel, Netlify, Cloudflare Pages, etc.).

## Créditos

CARTA es un producto de [Vivir de IA](https://vivirdeia.com), creado por [Isaac Wesley](https://www.linkedin.com/in/isaacwesleey/), desarrollado con [Lovable](https://lovable.dev).

Editor del proyecto: https://lovable.dev/projects/5183ac8b-7d53-46ef-bb82-76e434f8da7f

## Licencia y atribución

CARTA es una plantilla remixable. Los datos legales de la empresa que opera la instancia se definen en `src/config/company.ts`.
