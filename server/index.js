const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Sequelize connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// Define the SpotifyToken model
const SpotifyToken = sequelize.define('SpotifyToken', {
  access_token: DataTypes.STRING,
  token_type: DataTypes.STRING,
  expires_in: DataTypes.BIGINT,
  refresh_token: DataTypes.STRING,
}, {
  timestamps: true,
});

// Middleware to handle JSON requests
app.use(express.json());

// Route to start the login process by redirecting to Spotify's authorization page
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email'; // Add required scopes here
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  })}`;
  res.redirect(authUrl);
});

// Callback route that Spotify redirects to after the user authorizes the app
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    const { access_token, token_type, expires_in, refresh_token } = response.data;

    // Save the token information to the database
    await SpotifyToken.upsert({
      access_token,
      token_type,
      expires_in,
      refresh_token,
    });

    // Redirect to the frontend with the access token as a query parameter
    res.redirect(`http://localhost:3000/callback?token=${access_token}`);
  } catch (err) {
    console.error('Error during callback:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Starst the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
