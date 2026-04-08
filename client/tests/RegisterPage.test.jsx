import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../src/pages/RegisterPage';
import apiClient from '../src/api/client'; // <--- The fixed path

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

  it('renders fields and register button', () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('on success: navigates to /login', async () => {
    apiClient.post.mockResolvedValue({ status: 201 });
    render(<RegisterPage />, { wrapper: BrowserRouter });
    
    // Fill fields to pass HTML validation
    fireEvent.change(screen.getByLabelText(/display name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'new@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });

  it('submit button is disabled while loading', async () => {
    // Mock a pending promise so the "loading" state stays active
    apiClient.post.mockReturnValue(new Promise(() => {}));
    
    render(<RegisterPage />, { wrapper: BrowserRouter });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/display name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    // The button should now be disabled
    expect(screen.getByRole('button', { name: /register/i })).toBeDisabled();
  });

  it('on failure: displays error message', async () => {
    apiClient.post.mockRejectedValue({
      response: { data: { message: 'Email already taken' } }
    });

    render(<RegisterPage />, { wrapper: BrowserRouter });
    
    fireEvent.change(screen.getByLabelText(/display name/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'taken@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email already taken/i)).toBeInTheDocument();
  });
});