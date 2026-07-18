# Despliegue

Este documento describe cómo se construye y publica CARTA.

## Entornos

| Entorno | URL | Origen |
|---------|-----|--------|
| Producción | https://qr-dine-ease.lovable.app | Publicación desde Lovable |
| Desarrollo local | http://localhost:8080 | `npm run dev` |

## Build de producción

El build lo genera Vite:

```bash
npm install
npm run build
```

El resultado queda en `dist/` como conjunto de archivos estáticos listos para servirse desde cualquier CDN o hosting estático.

Para probar el build localmente:

```bash
npm run preview
```

## Publicación desde Lovable

1. Abrir el proyecto en el editor de Lovable.
2. Pulsar `Publish` (esquina superior derecha en desktop, inferior derecha en móvil).
3. Los cambios de frontend se hacen públicos tras pulsar `Update` en el diálogo de publicación.
4. Los cambios de backend (Edge Functions, migraciones) se despliegan de forma automática.

Al publicar por primera vez se crea el subdominio `*.lovable.app`. Después se puede conectar un dominio propio en `Project Settings -> Domains`.

## Sincronización con GitHub

El repositorio está conectado a GitHub mediante la integración oficial de Lovable. La sincronización es bidireccional:

- Los commits desde Lovable se pushan al repo.
- Los commits desde GitHub (local o pull request) se reflejan en Lovable.

Recomendaciones:

- No hacer force push ni rebase de ramas ya pusheadas.
- Trabajar sobre ramas de feature y mergear con PR contra `main`.
- Evitar editar los mismos archivos en Lovable y en local al mismo tiempo para no generar conflictos.

## Despliegue en otro hosting

Al ser un build estático, cualquiera de estas plataformas sirve:

- Vercel: importar el repo, framework `Vite`, build `npm run build`, output `dist`.
- Netlify: build `npm run build`, publish `dist`.
- Cloudflare Pages: build `npm run build`, output `dist`.
- Servidor propio: servir `dist/` con Nginx o similar, con fallback a `index.html` para el SPA routing.

## Configuración de Supabase

El cliente se define en `src/integrations/supabase/client.ts`. Para desplegar contra un proyecto propio:

1. Crear el proyecto en https://supabase.com.
2. Copiar `Project URL` y `anon key` (publishable).
3. Reemplazar las constantes en `client.ts` o pasarlas por variables de entorno:

   ```bash
   VITE_SUPABASE_URL="https://<proyecto>.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="<anon-key>"
   ```

4. Aplicar migraciones locales:

   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```

5. Regenerar los tipos TypeScript cuando cambie el esquema:

   ```bash
   npx supabase gen types typescript --linked > src/integrations/supabase/types.ts
   ```

Las claves privadas (`service_role`) nunca deben incluirse en el frontend ni en el repositorio. Se usan solo en Edge Functions o en scripts backend.

## Variables de entorno

Las variables consumidas por Vite deben empezar por `VITE_` para exponerse al cliente. Ejemplo de `.env`:

```bash
VITE_SUPABASE_URL="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
```

Añadir `.env` al `.gitignore` (ya viene incluido en el template estándar de Vite).

## Rollback

Desde Lovable se puede restaurar cualquier versión previa desde el historial de versiones. Desde GitHub, revertir con `git revert` sobre el commit problemático y abrir el PR correspondiente.
