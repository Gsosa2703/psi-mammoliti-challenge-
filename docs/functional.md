# Documento Funcional (MVP)

Permitir que pacientes encuentren psicólogos por temática y agenden sesiones online o presenciales, visualizando disponibilidad clara y adaptada al huso horario del paciente.

## Alcance del MVP

- Listado de psicólogos con: nombre, foto, temáticas, modalidad disponible (online/presencial/ambas), “poca disponibilidad”.

- Filtros por temática y modalidad.

- Detalle del psicólogo con calendario semanal y slots separados por modalidad.

- Reserva simulada con pantalla de confirmación.

- Husos horarios: se muestran horarios en la zona del paciente.

- Guardado de reservas en localStorage.

- Opcion de ver sesiones guardadas, cancelarlas o guardarlas

## Perfiles de usuario

Paciente: busca, filtra, ve disponibilidad y agenda.

Psicólogo: sólo lectura en este MVP (datos mock).

## Flujos cubiertos

- Búsqueda y Filtro

1. Usuario ingresa a Home.
2. Selecciona temática (puede seleccionar el badge o escribirlo)
3. Selecciona modalidad: Online / Presencial
4. Ve tarjetas con modalidad y próxima disponibilidad
   Criterios de aceptación

- Dado un filtro de temática “Ansiedad”, el listado muestra sólo psicólogos que la atienden.
- Dado un filtro de modalidad “Online”, se listan psicólogos con online disponible.

- Detalle + Disponibilidad por modalidad

1. Usuario entra al perfil.
2. Ve bio, especialidades y toggle/pestañas: Online | Presencial.
3. Calendario semanal muestra slots de la modalidad seleccionada, en el huso del paciente.
   Criterios de aceptación

- Si el psicólogo tiene slots “Online” lunes 09:00 y “Presencial” lunes 11:00, al cambiar de pestaña cambian los slots
- Los horarios se renderizan en la zona horaria del navegador del usuario.

- Reserva simulada

1. Usuario elige un slot.
2. Pantalla de Confirmación: psicólogo, modalidad, fecha/hora (con TZ).
3. Botón Confirmar → pantalla Éxito.
   Criterios de aceptación

- Tras confirmar, se muestra mensaje de éxito con modalidad y fecha/hora.

- Reserva simulada

1. Usuario elige un slot.
2. Pantalla de Confirmación: psicólogo, modalidad, fecha/hora (con TZ).
3. Botón Confirmar → pantalla Éxito.
   Criterios de aceptación

- Tras confirmar, se muestra mensaje de éxito con modalidad y fecha/hora.
