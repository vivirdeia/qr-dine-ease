## Estado actual

La app ya tiene: multi-tenant, roles (superadmin/owner/staff), auth básica, CRUD de carta/mesas/reservas, panel global, página pública por slug, planes y límites. Todo en `localStorage` bajo `carta_db`.

## Qué falta para que sea "completamente funcional" en localStorage

Asumiendo que el techo sigue siendo localStorage (un navegador = un universo, sin servidor, sin emails reales), estas son las piezas que faltan para cerrar el flujo de uso real:

### 1. Onboarding y configuración inicial
- Asistente de bienvenida tras registro: nombre del restaurante, slug, horario, primera categoría y primer plato.
- Validación de slug único (ahora puede chocar entre tenants) con sugerencia automática.
- Vista previa del enlace público y QR descargable (PNG/SVG) en el dashboard.

### 2. Gestión de carta más completa
- Reordenar platos y categorías por drag & drop (posición ya existe en el modelo).
- Subir imágenes de platos/logo/portada como base64 en localStorage, con aviso de tamaño y compresión automática.
- Alérgenos, etiquetas (vegano, sin gluten, picante) y variantes (medias raciones, tamaños) con precios.
- Marcar platos como "destacado" / "novedad".
- Importar/exportar carta como JSON o CSV.

### 3. Reservas usables de verdad
- Configurar duración media, aforo por franja y antelación mínima/máxima.
- Bloquear días/horas (vacaciones, días cerrados).
- Vista calendario semanal y vista de sala (qué mesa a qué hora).
- Cambiar estado de reserva (confirmada, sentada, no-show, cancelada) y asignar/mover mesa.
- Buzón de notificaciones in-app cuando llega una reserva nueva (ya hay `appNotifications`, falta engancharlo en todos los flujos y un indicador en el header).

### 4. Menú del día y promos
- Editor del menú del día con platos seleccionados de la carta, precio y disponibilidad por día de la semana.
- Banner configurable en la página pública (promoción, evento, cerrado por vacaciones).

### 5. Equipo y permisos finos
- Página de gestión de equipo con login real del staff (ya están las APIs, falta UI dedicada y filtrado de menú lateral por rol).
- Registro de auditoría: quién creó/editó/borró qué, visible para el owner.

### 6. Cuenta y datos del usuario
- Cambiar contraseña y email desde Ajustes.
- Cerrar sesión en todos los sitios (limpia `session`).
- Exportar todos los datos del tenant a JSON y reimportar.
- Borrar restaurante (con confirmación escribiendo el nombre).
- "Olvidé mi contraseña" simulado: como no hay email, pedir respuesta a una pregunta de seguridad definida al registrarse, o reset manual desde el panel superadmin.

### 7. Panel superadmin más útil
- Buscar tenants/usuarios, filtros por plan y estado.
- Métricas reales calculadas sobre los datos (nº platos, reservas últimos 30 días, último login).
- Crear/editar/borrar usuarios manualmente, resetear contraseña, asignar plan masivo.
- Exportar backup global e importarlo.

### 8. UX y robustez
- Estado vacío con CTA en cada sección (cuando no hay platos, mesas, reservas).
- Confirmaciones destructivas consistentes (AlertDialog) en borrados.
- Toasts de éxito/error en todas las mutaciones.
- Manejo de cuota de localStorage llena (try/catch al guardar + aviso al usuario).
- Versionado del esquema `carta_db` (`schemaVersion`) y migraciones futuras seguras.
- Modo oscuro respetando guía de diseño (ya hay tokens, falta el toggle).
- Página 404 con enlace a inicio (ya existe, revisar).

### 9. Página pública del restaurante
- Filtros por categoría, búsqueda y alérgenos.
- Formulario de reserva con validaciones (teléfono, capacidad vs aforo).
- Compartir por WhatsApp y enlace directo a Maps.
- SEO básico por restaurante: `<title>`, meta description, OpenGraph con logo.

### 10. Limitaciones honestas que conviene comunicar en la UI
- "Los datos se guardan solo en este navegador. Usa Exportar para hacer backup."
- Avisos cuando el staff invitado intenta entrar desde otro navegador (no funcionará hasta que haya backend).

---

## Propuesta de orden

No tiene sentido hacerlo todo en un golpe. Sugiero priorizar así y elegir por dónde empezar:

1. **Crítico para usar la app a diario**: QR + enlace público bien visible, subida de imágenes, reservas con estados y vista calendario, notificaciones in-app enganchadas.
2. **Crítico para que el dueño confíe**: exportar/importar JSON, cambiar contraseña, borrar cuenta, manejo de cuota llena, versionado de esquema.
3. **Pulido**: drag & drop, alérgenos/etiquetas, menú del día avanzado, filtros en la pública, SEO.
4. **Admin global**: búsqueda, métricas reales, backup global.

## Pregunta

¿Por dónde quieres que empiece? Puedo arrancar por el bloque 1 completo, o elegir piezas sueltas (por ejemplo solo "QR + imágenes" o solo "reservas con estados y calendario").
