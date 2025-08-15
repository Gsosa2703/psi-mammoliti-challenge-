import { getSessions, saveSession, updateSessionStatus, deleteSession, ScheduledSession } from './sessions';

describe('sessions', () => {
  const mockSession: ScheduledSession = {
    id: 'test1',
    psychologistId: 'psy1',
    psychologistName: 'Test Psy',
    modality: 'Online',
    datetime: '2023-01-01T10:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    status: 'scheduled',
    sessionMinutes: 50,
    priceUSD: 100,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  test('getSessions returns empty array initially', () => {
    expect(getSessions()).toEqual([]);
  });

  test('saveSession and getSessions', () => {
    saveSession(mockSession);
    const sessions = getSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toEqual(mockSession);
  });

  test('updateSessionStatus', () => {
    saveSession(mockSession);
    updateSessionStatus('test1', 'canceled');
    const sessions = getSessions();
    expect(sessions[0].status).toBe('canceled');
  });

  test('deleteSession', () => {
    saveSession(mockSession);
    deleteSession('test1');
    expect(getSessions()).toEqual([]);
  });
});
