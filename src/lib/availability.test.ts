import { formatDateKey, generateSlotsFromWeekly, groupSlotsByDateAndModality, formatLocalTimeLabel, AvailabilitySlot, WeeklyAvailability } from './availability';

describe('availability', () => {
  test('formatDateKey', () => {
    const date = new Date('2023-01-01T00:00:00');
    expect(formatDateKey(date)).toBe('2023-01-01');
  });

  test('generateSlotsFromWeekly basic', () => {
    const weekly: WeeklyAvailability = {
      online: { mon: ['09:00'] }
    };
    const from = new Date('2023-01-02T00:00:00');
    const to = new Date('2023-01-02T23:59:59');
    const slots = generateSlotsFromWeekly(weekly, 'psy1', from, to);
    expect(slots).toHaveLength(1);
    expect(slots[0].modality).toBe('Online');
    expect(slots[0].date).toMatch("2023-01-02T12:00:00.000Z");
  });

  test('groupSlotsByDateAndModality', () => {
    const slots: AvailabilitySlot[] = [
      { id: '1', psychologistId: 'p', modality: 'Online', date: '2023-01-01T10:00:00Z', status: 'free' },
      { id: '2', psychologistId: 'p', modality: 'Online', date: '2023-01-01T11:00:00Z', status: 'free' },
      { id: '3', psychologistId: 'p', modality: 'Presencial', date: '2023-01-02T10:00:00Z', status: 'free' },
    ];
    const grouped = groupSlotsByDateAndModality(slots);
    expect(grouped.online['2023-01-01']).toHaveLength(2);
    expect(grouped.presencial['2023-01-02']).toHaveLength(1);
    expect(grouped.online['2023-01-01'][0].date).toBe('2023-01-01T10:00:00Z');
  });

  test('formatLocalTimeLabel', () => {
    const iso = '2023-01-01T10:00:00Z';
    const label = formatLocalTimeLabel(iso);
    expect(label).toMatch(/\d{2}:\d{2}/);
  });
});
