import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import App from '../src/App';

vi.mock('../src/api/client', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: [] }), post: vi.fn() }
}));

test('renders Events Page header', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  
  // Changed "Event Planner" to "Events Page" to match your code
  const headerElement = screen.getByText(/events page/i);
  expect(headerElement).toBeInTheDocument();
});