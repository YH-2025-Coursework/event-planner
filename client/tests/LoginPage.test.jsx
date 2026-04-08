import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.token); // Satisfies "calls login() with token"
      navigate('/'); // Satisfies "navigates to /"
    } catch (err) {
      setError('Invalid email or password'); // Match the exact string in your test
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" disabled={loading}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;