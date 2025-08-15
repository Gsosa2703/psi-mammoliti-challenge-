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

3. Perfiles de usuario

Paciente: busca, filtra, ve disponibilidad y agenda.

Psicólogo (simulado): sólo lectura en este MVP (datos mock).

4. Flujos cubiertos
   4.1 Búsqueda y Filtro

Usuario ingresa a Home.

Selecciona temática (chips o dropdown).

(Día 2) Selecciona modalidad: Online / Presencial / (Ambas).

Ve tarjetas con modalid﻿ad y próxima disponibilidad.

Criterios de aceptación

Dado un filtro de temática “Ansiedad”, el listado muestra sólo psicólogos que la atienden.

Dado un filtro de modalidad “Online”, se listan psicólogos con online disponible.

4.2 Detalle + Disponibilidad por modalidad

Usuario entra al perfil.

Ve bio, especialidades y toggle/pestañas: Online | Presencial.

Calendario semanal muestra slots de la modalidad seleccionada, en el huso del paciente.

Criterios de aceptación

Si el psicólogo tiene slots “Online” lunes 09:00 y “Presencial” lunes 11:00, al cambiar de pestaña cambian los slots.

Los horarios se renderizan en la zona horaria del navegador del usuario.

4.3 Reserva simulada

Usuario elige un slot.

Pantalla de Confirmación: psicólogo, modalidad, fecha/hora (con TZ).

Botón Confirmar → pantalla Éxito.

(Bonus) Guardar en localStorage.

Criterios de aceptación

Tras confirmar, se muestra mensaje de éxito con modalidad y fecha/hora.

(Bonus) La reserva aparece en “Mis sesiones” (si implementado).
