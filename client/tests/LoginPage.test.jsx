import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';

// Mock dependencies
vi.mock('../src/api/client');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

describe('LoginPage Foundation', () => {
  it('renders email, password fields and a Login button', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});