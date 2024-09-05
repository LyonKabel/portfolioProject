import React from 'react';
import '../App.css';

function Login() {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://localhost:3000/callback'; 
    const scope = 'user-read-private user-read-email'; 

    if (!clientId) {
      console.error('Client ID is missing. Ensure REACT_APP_SPOTIFY_CLIENT_ID is set in .env file.');
      return;
    }

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  return (
    <div>
      <button className="login-button" onClick={handleLogin}>Log in with Spotify</button>
    </div>
  );
}

export default Login;
