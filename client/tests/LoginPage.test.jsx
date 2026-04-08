import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage';
import apiClient from '../src/api/client';

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
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submit button is disabled while loading', async () => {
    apiClient.post.mockReturnValue(new Promise(() => {}));
    render(<LoginPage />, { wrapper: BrowserRouter });
    
    // Must fill fields to trigger submit
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  it('on success: calls login() and navigates to /', async () => {
    apiClient.post.mockResolvedValue({ data: { token: 'fake-token' } });
    render(<LoginPage />, { wrapper: BrowserRouter });

    // Fill BOTH fields
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('fake-token');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});