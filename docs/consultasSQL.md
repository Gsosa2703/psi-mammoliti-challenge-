# Sessions Model and SQL Queries

## Sessions Model

```sql
CREATE TYPE modality AS ENUM ('online','presencial');

CREATE TABLE sessions (
  id              SERIAL PRIMARY KEY,
  patient_id      INT NOT NULL,
  psychologist_id INT NOT NULL,
  topic           TEXT NOT NULL,           -- temática
  modality        modality NOT NULL,       -- online / presencial
  start_at        TIMESTAMPTZ NOT NULL,    -- fecha/hora de la sesión
  duration_min    INT NOT NULL DEFAULT 50
);
```

## SQL Queries

### a) Most consulted topic

```sql
SELECT topic, COUNT(*) AS total
FROM sessions
GROUP BY topic
ORDER BY total DESC
LIMIT 1;
```

### b) Day with most sessions

```sql
SELECT TO_CHAR(start_at, 'Day') AS weekday, COUNT(*) AS total
FROM sessions
GROUP BY 1
ORDER BY total DESC
LIMIT 1;
```

-- Variant by day number (Monday=1..Sunday=7)

```sql
SELECT EXTRACT(ISODOW FROM start_at) AS dow, COUNT(*) AS total
FROM sessions
GROUP BY dow
ORDER BY total DESC, dow
LIMIT 1;
```

### c) Most used modality

```sql
SELECT modality, COUNT(*) AS total
FROM sessions
GROUP BY modality
ORDER BY total DESC
LIMIT 1;
```
