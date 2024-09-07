import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      fetch(`http://localhost:3001/api/login?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('jwt', data.jwt);
          navigate('/search');
        })
        .catch(() => navigate('/login'));
    }
    
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;
