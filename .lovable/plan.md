

# Lo que le falta a Carta para ser 100% funcional

## Ya funciona
- CRUD de platos, categorías, mesas, reservas (localStorage)
- Registro + selección de plan + checkout simulado + onboarding
- Login con credenciales dinámicas
- Paleta de colores personalizable
- Tracking (GA, Meta Pixel)
- Filtro de vinos, compartir carta, calendario .ics
- Fotos en platos, bebidas y vinos

## Lo que falta (por prioridad)

### 1. Protección de rutas
- `/dashboard` sin login → redirige a `/register` o login
- `/register` si ya logueado → redirige a `/dashboard`
- Actualmente cualquiera puede acceder al dashboard directamente

### 2. Métricas con datos reales
- Las métricas (reservas totales, ocupación, no-show) vienen de `metricsData` hardcodeado en mockData
- Deberían calcularse a partir de las reservas reales del contexto

### 3. Multi-idioma en carta pública
- El selector de idioma (ES/EN/FR) existe pero no traduce nada
- Implementar traducción básica de la carta pública (títulos de sección, botones, labels)

### 4. Gestión de vinos completa
- No se pueden crear/editar/eliminar vinos desde el dashboard
- Solo se pueden ver

### 5. Notificaciones funcionales
- La campana del dashboard muestra un punto rojo estático
- No hay lista de notificaciones ni centro de notificaciones
- Los settings de notificaciones (email al reservar, resumen diario) no hacen nada visible

### 6. Drag & drop para reordenar
- Categorías y platos tienen campo `position` pero no se pueden reordenar visualmente
- Los iconos de grip (⠿) son decorativos

### 7. Carta de vinos en el dashboard
- CRUD de vinos: crear, editar, eliminar vinos con foto, precio, tipo, bodega

### 8. Exportar datos
- No hay exportación de reservas a CSV/Excel
- No hay descarga de la carta en PDF

### 9. Validación de límites por plan
- Plan Free dice "20 platos, 3 categorías" pero no se aplica ningún límite
- El usuario Free puede crear platos ilimitados igual que Pro

### 10. PWA / Offline
- El `manifest.json` existe pero no hay service worker
- La carta pública podría funcionar offline para el cliente final

## Plan de implementación propuesto

Abordaría los **5 más impactantes** en orden:

### Fase 1 — Protección de rutas + límites de plan
- Wrapper `<ProtectedRoute>` que redirige a login si no autenticado
- Lógica en Dashboard que bloquea crear más platos/categorías si excede el límite del plan Free
- Banner "Upgrade" cuando el usuario alcanza el límite

### Fase 2 — Métricas reales
- Reemplazar `metricsData` por cálculos sobre `reservations[]` del contexto
- KPIs: total reservas, completadas, no-shows, tasa cancelación
- Gráficos calculados por día/semana real

### Fase 3 — CRUD de vinos
- Sección de vinos en el dashboard con crear/editar/eliminar
- Campos: nombre, bodega, tipo, DO, precio, año, descripción, foto
- Métodos `addWine`, `updateWine`, `deleteWine` en AppContext

### Fase 4 — Multi-idioma básico
- Diccionario ES/EN/FR para labels de la carta pública
- Traduce secciones, botones, alérgenos — no los nombres de platos (eso lo pone el restaurante)

### Fase 5 — Notificaciones y exportación
- Centro de notificaciones con lista de eventos recientes (nueva reserva, cancelación)
- Exportar reservas a CSV desde el dashboard

### Archivos afectados
| Archivo | Cambios |
|---------|---------|
| `src/App.tsx` | ProtectedRoute wrapper |
| `src/context/AppContext.tsx` | CRUD vinos, lógica de límites |
| `src/pages/Dashboard.tsx` | Métricas reales, CRUD vinos, notificaciones, exportar CSV, limites plan |
| `src/pages/PublicRestaurant.tsx` | Multi-idioma |
| `src/data/mockData.ts` | Añadir métodos a Wine |

