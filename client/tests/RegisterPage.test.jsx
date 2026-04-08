import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../src/pages/RegisterPage';
import apiClient from '../src/api/client';

vi.mock('../src/api/client');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders display name, email, password fields and a Register button', () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByPlaceholderText(/display name/i) || screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('submit button is disabled while loading', () => {
    apiClient.post.mockReturnValue(new Promise(() => {}));
    render(<RegisterPage />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  it('on success: navigates to /login', async () => {
    apiClient.post.mockResolvedValue({ status: 201 });
    render(<RegisterPage />, { wrapper: BrowserRouter });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('on failure: displays the error message returned by the API', async () => {
    const apiError = 'User already exists';
    apiClient.post.mockRejectedValue({
      response: { data: { message: apiError } }
    });

    render(<RegisterPage />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(apiError)).toBeInTheDocument();
  });
});