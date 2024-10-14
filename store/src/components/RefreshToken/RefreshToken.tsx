import React from 'react';
import axios from 'axios';
import styles from './RefreshToken.module.css';
import API_BASE_URL from '../../config/apiConfig';

const RefreshToken: React.FC = () => {
  const handleRefresh = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('token', response.data.access);
      alert('Token refreshed successfully');
    } catch (error) {
      alert('Failed to refresh token');
    }
  };

  return (
    <div className={styles.refreshContainer}>
      <button onClick={handleRefresh}>Refresh Token</button>
    </div>
  );
};

export default RefreshToken;
