import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('jwt');

    try {
      await fetch('http://localhost:3001/api/logout', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Remove token from local storage
      localStorage.removeItem('jwt');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout} className="logout-button">Log Out</button>;
};

export default LogoutButton;
