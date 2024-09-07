const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken');
const { sequelize, DataTypes } = require('../db');
const SpotifyToken = require('../models/SpotifyToken')(sequelize, DataTypes);

// Spotify API setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,  
});

// Login and token exchange
const login = async (req, res) => {
  const { code } = req.query;
  console.log("code" , code)
  if (!code) return res.status(400).json({ error: 'Authorization code is missing.' });

  try {
    // Exchange authorization code for tokens
    const data = await spotifyApi.authorizationCodeGrant(code);
    const token = data.body;

    // Save the token in DB
    await SpotifyToken.upsert({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      token_type: token.token_type,
      expires_in: token.expires_in,
    });

    // Create JWT token
    const jwtToken = jwt.sign({ userId: 'spotify_user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ access_token: token.access_token, jwt: jwtToken });
  } catch (err) {
    console.error('Error during Spotify login:', JSON.stringify(err, null, 2)); // Log detailed error
    res.status(500).json({ error: 'Failed to retrieve access token', details: err.message });
  }  
};

// Check token status
const status = async (req, res) => {
  try {
    const token = await SpotifyToken.findOne();
    if (token) {
      res.json({ token });
    } else {
      res.status(404).json({ error: 'No token found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving token', details: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // Delete all tokens from the database
    await SpotifyToken.destroy({ where: {} }); // Delete all records
    res.status(200).json({ message: 'Successfully logged out and cleared all tokens.' });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ error: 'Failed to log out', details: err.message });
  }
};


const search = async (req, res) => {
  const { query, type } = req.query;
  if (!query || !type) return res.status(400).json({ error: 'Query and type are required' });

  try {
    const tokenRecord = await SpotifyToken.findOne();
    if (!tokenRecord) return res.status(401).json({ error: 'No token found' });

    spotifyApi.setAccessToken(tokenRecord.access_token);  // Set the access token
    const data = await spotifyApi.search(query, [type]);

    // Log the entire response from Spotify
    console.log('Spotify API Response:', JSON.stringify(data, null, 2));

    const results = {
      albums: data.body.albums?.items || [],
      tracks: data.body.tracks?.items || [],
      artists: data.body.artists?.items || [],
    };

    res.json(results);
  } catch (err) {
    console.error('Spotify search error:', err); // Log detailed error
    res.status(500).json({ error: 'Failed to search Spotify', details: err.message });
  }
};







module.exports = { login, status, search, logout };
