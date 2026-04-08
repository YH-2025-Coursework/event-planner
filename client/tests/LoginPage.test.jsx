import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import apiClient from '../src/api/client';

// Mocks
vi.mock('../src/api/client');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password fields and a Login button', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    // Checks for either label or placeholder to be safe
    expect(screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submit button is disabled while loading', async () => {
    apiClient.post.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<LoginPage />, { wrapper: BrowserRouter });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  it('on success: calls login() with the token and navigates to /', async () => {
    apiClient.post.mockResolvedValue({ data: { token: 'test-token' } });
    render(<LoginPage />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('on failure: displays "Invalid email or password"', async () => {
    apiClient.post.mockRejectedValue(new Error('Failed'));
    render(<LoginPage />, { wrapper: BrowserRouter });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const error = await screen.findByText(/invalid email or password/i);
    expect(error).toBeInTheDocument();
  });
});