const express = require('express');
const axios = require('axios');
const cors = require('cors')
const querystring = require('querystring');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const spotifyRoutes = require('./routes/spotifyRoutes'); // Import the routes module



const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Sequelize connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});



// Middleware to handle JSON requests
app.use(express.json());

// Use the routes from spotifyRoutes
app.use('/api', spotifyRoutes);



// Route to start the login process by redirecting to Spotify's authorization page
app.get('/api/login', (req, res) => {
  const scope = 'user-read-private user-read-email'; // Add required scopes here
  const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  })}`;
  res.redirect(authUrl);
});

app.get('/api/status', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract the token

  try {
    const decoded = await verifyToken(token); // Verify the token
    const storedToken = await getTokenFromDatabase(decoded.userId); // Fetch the token from DB

    if (storedToken) {
      return res.json({ valid: true, token: storedToken });
    } else {
      return res.status(401).json({ valid: false });
    }
  } catch (error) {
    return res.status(401).json({ valid: false });
  }
});

// Callback route that Spotify redirects to after the user authorizes the app
app.get('/api/callback', async (req, res) => {
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

app.delete('/api/logout', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract the token

  try {
    const decoded = await verifyToken(token); // Verify the token
    await SpotifyToken.destroy({ where: { userId: decoded.userId } }); // Delete the token from DB
    return res.status(204).send(); // No content response
  } catch (error) {
    return res.status(401).json({ message: 'Logout failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
