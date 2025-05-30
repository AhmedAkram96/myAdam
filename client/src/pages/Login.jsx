import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.safeUser));
      // Redirect based on user type
      if (data.safeUser.isPainter) {
        navigate('/painter');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="logo">Adam</h1>
        <img src="/paint-illustration.svg" alt="Paint Illustration" className="auth-illustration" />
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit">Sign In</button>
        <div className="auth-footer">
          <span>Doesn't have an account? </span>
          <Link to="/register">Register now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 