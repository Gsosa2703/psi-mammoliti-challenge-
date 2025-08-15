import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  test('renders header and filters', () => {
    render(<Home />);
    expect(screen.getByText('Encuentra tu psicólogo ideal')).toBeInTheDocument();
    expect(screen.getByText('Psicólogos disponibles')).toBeInTheDocument();
  });
});
