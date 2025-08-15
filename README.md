# Psi Sesiones

## Introducción

Aplicación demo para descubrir psicólogos, ver disponibilidad de turnos y reservar sesiones.

## Instrucciones de uso

- Requisitos
  - Node 18+ (sugerido 20+)
- Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

- Lint

```bash
npm run lint
```

- Build/Producción

```bash
npm run build
npm start
```

- Despliegue (recomendado): Vercel
  - Conectar el repo y “Deploy”. No requiere variables de entorno en esta demo.

## Stack técnico y decisiones

- Next.js (15)
  - Elegido por: enrutamiento de archivos, Server/Client Components, despliegue 1-click en Vercel, soporte a SSR/ISR para escalar catálogos y listados.
  - Vercel: CDN global, previews por PR, logs/observabilidad, edge functions si fuera necesario (futuros webhooks y schedulers).
- TypeScript
  - Tipado fuerte para modelos (`AvailabilitySlot`, `WeeklyAvailability`, `Psychologist`, `ScheduledSession`) y props de componentes.
  - Reduce errores en refactors y facilita documentación viviente.
- Tailwind CSS + shadcn/ui
  - Tailwind para composición rápida de UI, dark mode, clases utilitarias.
  - shadcn/ui como estilo de componentes ligeros y consistentes (`button`, `dialog`, `input`, `textarea`, `label`, `calendar`).
- dayjs
  - Manejo confiable de fechas, formateo por locale, y conversiones UTC⇄local.
  - Decisión clave: guardar horarios de disponibilidad en UTC ISO y renderizar en hora local del usuario.
- Almacenamiento cliente (localStorage)
  - Persistimos las reservas del usuario en `localStorage` (no hay backend en esta demo).

## Modelos de datos

- AvailabilitySlot

  ```ts
  type AvailabilitySlot = {
  id: string;
  psychologistId: string;
  modality: Modality;
  date: string;
  status: 'free' | 'held' | 'booked' | 'canceled';
  };
  ```

- WeeklyAvailability
  - `online?: Partial<Record<Weekday, string[]>>` y `presencial?: ...` con horas "HH:MM" locales por día.
  - Se usa para generar slots para un rango de fechas.
- Psychologist

  - Modelo base del profesional. Campos principales y opcionales que usa la app:

  ```ts
  type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  modalities: Array<'Online' | 'Presencial'>;
  rating?: number;
  experienceYears: number;
  sessionMinutes: number;
  priceUSD: number;
  bio: string;
  weeklyAvailability?: WeeklyAvailability;
  slots?: AvailabilitySlot[];
  };
  ```

  - Notas:
    - Si `slots` está presente, se utiliza directamente. Si no, se generan slots a partir de `weeklyAvailability` para la ventana visible (90 días).
    - El flag `limited` se calcula en runtime según la cantidad de slots libres (<= 5) y la(s) modalidad(es) filtradas por el usuario.

## Disponibilidad y fechas

- Generación de slots: `generateSlotsFromWeekly(weekly, psychologistId, from, to)` transforma una plantilla semanal en muchos `AvailabilitySlot` (en UTC) para el rango solicitado (90 días por defecto en la UI).
- Agrupación y rendering: `groupSlotsByDateAndModality(slots)` devuelve los slots agrupados por día y modalidad para pintar el calendario y los horarios disponibles.
- Etiquetas de hora: `formatLocalTimeLabel(isoUtc)` presenta "HH:mm" en la zona local del usuario.
- Clave de día: `formatDateKey(date)` produce `YYYY-MM-DD` y permite deshabilitar días sin disponibilidad en el calendario.
- Timezones: los horarios se guardan en UTC para integridad; se muestran en local. Esto evita inconsistencias por cambios de TZ o DST.

## Funcionalidades principales

- Listado con filtros (`/`)
  - Búsqueda por nombre y especialidad.
  - Filtro por modalidad (Online/Presencial).
  - Toggle “Poca disponibilidad”.
- Perfil del profesional (`/profesionales/[id]`)
  - Calendario con días habilitados según slots.
  - Horarios por modalidad, en la hora local del usuario.
  - Reserva: guarda una sesión en localStorage y muestra confirmación.
- Mis sesiones (`/mis-sesiones`)
  - Lista “Próximas” e “Historial”.
  - Acciones: Cancelar / Eliminar (persisten en localStorage).
- Poca Disponibilidad
  - Se pueden ver psicologos que tienen poca disponibilidad

## Supuestos y decisiones

- Un paciente puede agendar una sesion en los proximos 90 dias
- Un psicólogo es “limitado” cuando tiene 5 o menos slots libres en la ventana de 90 días
- Un paciente puede reservar una sesion online y presencial, no hay limites en cuanto a modalidad. Puede usar ambas
- No hay backend: las reservas se guardan en el navegador (localStorage). En producción, esto debería ser una API segura con autenticación.
- Los slots se consideran de 50 minutos (por `sessionMinutes` del profesional). No se valida solapamiento en el cliente (la demo no simula simultaneidad real).
- El catálogo es estático (JSON). En producción se usaría una base de datos

## Extensiones sugeridas (futuro)

- Backend (BFF) con endpoints para:
  - Listado de profesionales, filtrado y paginación.
  - Generación/actualización de slots (jobs nocturnos).
  - Reserva real: transición `free → held → booked` y manejo de concurrencia.
- Autenticación, “Mis sesiones” atado a usuario.
- Pagos (Stripe) y políticas de cancelación/reembolso.
- Notificaciones (email/SMS/WhatsApp) y recordatorios.
- i18n completa, accesibilidad, y tests e2e/integ.
