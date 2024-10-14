import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import API_BASE_URL from '../../config/apiConfig';

interface LoginProps {
  onLogin: () => void; // Define the prop type for onLogin
}

const Login: React.FC<LoginProps> = ({ onLogin }) => { // Accept onLogin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/`, { username, password });
      localStorage.setItem('token', response.data.access);
      onLogin(); // Call onLogin after successful login
      navigate('/customers');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
