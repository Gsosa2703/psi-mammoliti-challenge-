import { render, screen } from '@testing-library/react';
import MySessionsPage from './page';
import * as sessionsLib from '../../lib/sessions';

jest.mock('../../lib/sessions');

describe('MySessionsPage', () => {
  test('renders with no sessions', () => {
    (sessionsLib.getSessions as jest.Mock).mockReturnValue([]);
    render(<MySessionsPage />);
    expect(screen.getByText('Mis sesiones')).toBeInTheDocument();
    expect(screen.getByText('No tienes sesiones programadas.')).toBeInTheDocument();
    expect(screen.getByText('No hay historial.')).toBeInTheDocument();
  });
});
