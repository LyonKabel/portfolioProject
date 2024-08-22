
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; 
import Search from './Components/Search';
import Login from './Components/Login';
import Callback from './Components/Callback';
import './App.css'; 
function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/status', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid === false) {
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [token]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={isAuthenticated ? <Search /> : <Navigate to="/login" />} />
      <Route path="/search" element={<Search />} />
      <Route path="/callback" element={<Callback />} />
      

    </Routes>
  );
}

export default App;
