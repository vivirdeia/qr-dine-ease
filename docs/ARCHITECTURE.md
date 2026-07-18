# Arquitectura

Este documento describe la arquitectura general de CARTA: rutas, gestión de estado, datos y componentes clave.

## Rutas y páginas

Todas las rutas se declaran en `src/App.tsx` usando React Router 6.

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | `pages/Landing.tsx` | Público |
| `/login` | `pages/Login.tsx` | Redirige si ya hay sesión |
| `/register` | `pages/Register.tsx` | Redirige si ya hay sesión |
| `/dashboard` | `pages/Dashboard.tsx` | Roles `owner` y `staff` |
| `/admin` | `pages/SuperAdmin.tsx` | Rol `superadmin` |
| `/r/:slug` | `pages/PublicRestaurant.tsx` | Público, carta del restaurante |
| `/caracteristicas`, `/pricing`, `/demo`, `/changelog`, `/ayuda`, `/guias`, `/api-docs` | `pages/info/*` | Público |
| `/privacidad`, `/terminos`, `/cookies`, `/gdpr` | `pages/legal/*` | Público |
| `/sobre-nosotros`, `/contacto` | `pages/info/*` | Público |
| `*` | `pages/NotFound.tsx` | Fallback |

El componente `ProtectedRoute` valida el rol y redirige a `/login` cuando no hay sesión o a la home del rol cuando el usuario no tiene permisos.

## Gestión de estado

### AppContext

`src/context/AppContext.tsx` centraliza el estado de la aplicación en un único proveedor. Expone:

- Sesión: `isLoggedIn`, `role`, `userEmail`, `userName`, `userPlan`.
- Tenants: creación, resolución por slug, cambio de tenant activo.
- Datos por tenant: restaurante, categorías, platos, vinos, mesas, reservas, notificaciones, vistas de platos.
- Métodos CRUD para todas las entidades y helpers para plan, branding y tracking.

La persistencia se implementa con `hooks/useLocalStorage.ts`, que sincroniza el estado con `localStorage`. Toda la app funciona sin backend, aunque Supabase queda listo para migrar cuando se necesite.

### Roles y multi-tenant

Cada usuario pertenece a uno o varios tenants con un rol asociado. Los roles reconocidos son:

- `superadmin`: acceso al panel `/admin` con todos los tenants y usuarios.
- `owner`: dueño del restaurante, acceso completo al Dashboard.
- `staff`: acceso limitado a operaciones diarias.

## Datos mock

`src/data/mockData.ts` define los tipos (`Restaurant`, `Dish`, `Category`, `Wine`, `Table`, `Booking`, `Notification`) y las estructuras iniciales que se cargan al registrar el primer tenant.

`src/data/dishImages.ts` y `src/data/wineImages.ts` mapean IDs a imágenes precargadas.

`src/data/translations.ts` contiene los strings traducidos para ES, EN, FR y CA que consume la carta pública.

## Integración Supabase

`src/integrations/supabase/client.ts` crea el cliente único con `createClient<Database>()`, configurado con persistencia en `localStorage` y refresh automático de token.

`src/integrations/supabase/types.ts` contiene los tipos generados desde el esquema del proyecto Supabase. Se regeneran cuando cambia el esquema.

`supabase/config.toml` guarda la configuración local del proyecto Supabase (linkado al proyecto remoto para migraciones).

## Sistema de traducciones

La carta pública detecta el idioma del selector y busca en `src/data/translations.ts` la clave adecuada. Si falta traducción se hace fallback al español. Los platos y categorías se muestran tal como los introduzca el owner (no hay traducción automática por ahora).

## Componentes públicos

- `components/public/DishModal.tsx`: modal accesible que muestra la foto grande del plato, descripción, variantes, alérgenos y etiquetas dietéticas. Al abrirse dispara `trackDishView` para alimentar las métricas.
- `components/public/LocationMap.tsx`: iframe de Google Maps con bordes redondeados y botones "Cómo llegar" y "Abrir".
- `components/CookieBanner.tsx`: banner GDPR gestionado por `hooks/useCookieConsent.ts`. Los scripts de tracking solo se cargan tras aceptar.

## Componentes de landing

En `components/landing/` viven los bloques específicos de la home:

- `DashboardMockup.tsx`: preview visual del panel usado en el hero.
- `InteractiveDemo.tsx`: recorrido interactivo por las funcionalidades.
- `TrustBar.tsx`, `MigrationHelp.tsx`: bloques de conversión.
- `FadeIn.tsx`: wrapper de animaciones basado en Framer Motion.

## Flujo de una petición típica

```text
Usuario -> Ruta React Router -> Página -> useApp() -> AppContext
                                            |
                                            v
                                    useLocalStorage <-> localStorage
                                            |
                                            v
                                    (opcional) Supabase client
```
