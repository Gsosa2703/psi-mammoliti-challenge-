# Psi Sesiones

## Introducción

Aplicación demo para descubrir psicólogos, ver disponibilidad de turnos y reservar sesiones.

## Instrucciones de uso

- Requisitos

  - Node 18+ (sugerido 20+)

- Local

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

- Deploy (recomendado): Vercel
  - Conectar el repo y “Deploy”. No requiere variables de entorno en esta demo. Link: https://psi-mammoliti-challenge-j3we.vercel.app/

## Stack técnico y decisiones

- Next.js 15 + Vercel: enrutamiento por archivos, SSR/ISR, deploy 1-click.

- TypeScript: tipado fuerte de modelos y props.

- Tailwind CSS + shadcn/ui: UI rápida y consistente.

- dayjs (UTC ⇄ TZ local): horarios consistentes sin sorpresas por husos/DST.

- localStorage: persistencia de reservas del usuario (sin backend en el MVP).

## Modelos de datos

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

- Fiabilidad horario: fuente de verdad en UTC; conversión al render en local con dayjs().local()
- Un paciente puede agendar una sesion en los proximos 90 dias
- Un psicólogo es “limitado” cuando tiene 5 o menos slots libres en la ventana de 90 días
- Un paciente puede reservar una sesion online y presencial, no hay limites en cuanto a modalidad. Puede usar ambas
- No hay backend: las reservas se guardan en el navegador (localStorage). En producción, esto debería ser una API segura con autenticación.
- Los slots se consideran de 50 minutos (por `sessionMinutes` del profesional). No se valida solapamiento en el cliente (la demo no simula simultaneidad real).
- El catálogo es estático (JSON). En producción se usaría una base de datos
- Concurrencia inexistente: no se simula doble reserva del mismo slot por dos usuarios; requeriría backend

## Extensiones sugeridas (futuro)

- Backend (BFF) con endpoints para:
  - Listado de profesionales, filtrado y paginación.
  - Generación/actualización de slots (jobs nocturnos).
  - Reserva real: transición `free → held → booked` y manejo de concurrencia.
- Autenticación, “Mis sesiones” atado a usuario.
- Pagos (Stripe) y políticas de cancelación/reembolso.
- Notificaciones (email/SMS/WhatsApp) y recordatorios.
- i18n completa, accesibilidad, y tests e2e/integ.
