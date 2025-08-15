import { render, screen } from '@testing-library/react';
import PsychologistCard from './PsychologistCard';

describe('PsychologistCard', () => {
  const mockData = {
    id: '1',
    name: 'Test Psychologist',
    image: '/test.jpg',
    specialties: ['Anxiety'],
    modalities: ['Online'],
    experienceYears: 5,
    sessionMinutes: 50,
    priceUSD: 100,
  };

  test('renders psychologist name and details', () => {
    render(<PsychologistCard data={mockData} />);
    expect(screen.getByText('Test Psychologist')).toBeInTheDocument();
    expect(screen.getByText('5+ años')).toBeInTheDocument();
    expect(screen.getByText('USD 100')).toBeInTheDocument();
  });
});
