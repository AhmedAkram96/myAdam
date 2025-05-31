import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl } from '../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!userType) {
      setError('Please select a user type.');
      return;
    }
    if (!city) {
      setError('Please select a city.');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, city, isPainter: userType === 'painter' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/login');
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
        <label htmlFor="city">City</label>
        <div className="input-group">
          <span className="input-icon">🏙️</span>
          <select
            id="city"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          >
            <option value="" disabled>Select your city</option>
            <option value="Prague">Prague</option>
            <option value="Cairo">Cairo</option>
          </select>
        </div>
        <div className="user-type-group">
          <label>
            <input
              type="checkbox"
              checked={userType === 'client'}
              onChange={() => setUserType(userType === 'client' ? '' : 'client')}
            /> Home Owner
          </label>
          <label>
            <input
              type="checkbox"
              checked={userType === 'painter'}
              onChange={() => setUserType(userType === 'painter' ? '' : 'painter')}
            /> Painter
          </label>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit">Register</button>
        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 