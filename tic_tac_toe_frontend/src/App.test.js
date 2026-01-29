import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and initial status', () => {
  render(<App />);
  expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
  expect(screen.getByText(/next player:\s*x/i)).toBeInTheDocument();
});
