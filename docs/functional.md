# Documento Funcional (MVP)

Permitir que pacientes encuentren psicólogos por temática y agenden sesiones online o presenciales, visualizando disponibilidad clara y adaptada al huso horario del paciente.

## Alcance del MVP

- Listado de psicólogos con: nombre, foto, temáticas, modalidad disponible (online/presencial/ambas), “poca disponibilidad”.
- Filtros por temática y modalidad.
- Detalle del psicólogo con calendario semanal y slots separados por modalidad.
- Reserva simulada con pantalla de confirmación.
- Husos horarios: se muestran horarios en la zona del paciente.
- Guardado de reservas en `localStorage`.
- Opción de ver sesiones guardadas, cancelarlas o eliminarlas.

## Perfiles de Usuario

- **Paciente**: busca, filtra, ve disponibilidad y agenda.
- **Psicólogo**: solo lectura en este MVP (datos mock).

## Flujos Cubiertos

### Búsqueda y Filtro

1. Usuario ingresa a **Home**.
2. Selecciona temática (puede elegir un badge o escribirlo).
3. Selecciona modalidad: **Online** / **Presencial**.
4. Ve tarjetas con modalidad y próxima disponibilidad.

**Criterios de aceptación**:

- Dado un filtro de temática “Ansiedad”, el listado muestra solo psicólogos que la atienden.
- Dado un filtro de modalidad “Online”, se listan psicólogos con online disponible.

---

### Detalle + Disponibilidad por Modalidad

1. Usuario entra al perfil del psicólogo.
2. Ve bio, especialidades y un toggle/pestañas: **Online | Presencial**.
3. El calendario semanal muestra los slots de la modalidad seleccionada, en el huso horario del paciente.

**Criterios de aceptación**:

- Si el psicólogo tiene slots **Online** el lunes 09:00 y **Presencial** el lunes 11:00, al cambiar de pestaña cambian los slots.
- Los horarios se renderizan en la zona horaria del navegador del usuario.

---

### Reserva Simulada

1. Usuario elige un slot.
2. Pantalla de Confirmación: psicólogo, modalidad, fecha/hora (con TZ).
3. Botón **Confirmar** → pantalla de éxito.

**Criterios de aceptación**:

- Tras confirmar, se muestra mensaje de éxito con modalidad y fecha/hora.

---

### Gestión de Sesiones Guardadas

1. Usuario confirma una sesión → se guarda en **Mis Sesiones**.
2. Desde **Mis Sesiones**, puede cancelar o eliminar la sesión.
