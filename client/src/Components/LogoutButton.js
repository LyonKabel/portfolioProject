import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../logout.css';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.error('No JWT token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      // Clear local storage and navigate to login
      localStorage.removeItem('jwt');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
