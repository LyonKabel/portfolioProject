const SpotifyWebApi = require('spotify-web-api-node');
const { SpotifyToken } = require('../models/SpotifyTokens'); 

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const login = async (req, res) => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    const token = data.body;

    await SpotifyToken.upsert({
      access_token: token.access_token,
      token_type: token.token_type,
      expires_in: token.expires_in,
      refresh_token: token.refresh_token
    });

    spotifyApi.setAccessToken(token.access_token);
    res.json({ message: 'Access token retrieved and saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve and save access token', details: err.message });
  }
};

const auth = (req, res) => {
  res.send('Auth endpoint');
};

const status = async (req, res) => {
  try {
    const tokenRecord = await SpotifyToken.findOne();
    if (tokenRecord) {
      res.json({ token: tokenRecord });
    } else {
      res.status(500).json({ error: 'No token found in the database' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving token from the database' });
  }
};

const search = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const data = await spotifyApi.searchTracks(query);
    res.json(data.body);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  login,
  auth,
  status,
  search
};
