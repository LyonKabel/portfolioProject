import React from 'react';
import '../App.css';


function Login() {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <button className="login-button" onClick={handleLogin}>Login with Spotify</button>
      </div>
    </div>
  );
}

export default Login;
