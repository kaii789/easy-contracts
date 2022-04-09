import { render, screen } from '@testing-library/react';
import App from './App';

test('basic app test', () => {
  render(<App />);

  expect(screen.getByRole("banner")).toBeInTheDocument();
});
