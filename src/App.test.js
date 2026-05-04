import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quiz login', () => {
  render(<App />);
  const titleElement = screen.getByText(/linux & cyber quiz/i);
  expect(titleElement).toBeInTheDocument();
});
