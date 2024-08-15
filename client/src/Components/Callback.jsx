import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    console.log("Token from URL:", token); 

    if (token) {
      localStorage.setItem('jwt', token);
      console.log("Token saved to localStorage");
      navigate('/search'); 
    } else {
      console.log("No token found, redirecting to login"); 
      navigate('/login'); 
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;
