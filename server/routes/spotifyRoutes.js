const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback',
});

// Route to log in
router.get('/login', spotifyController.login);

// Route for authorization
router.get('/auth', spotifyController.auth);

// Route to get the status
router.get('/status', spotifyController.status);

// Route to search for tracks, artists, albums, playlists
router.get('/search', spotifyController.search);


router.post('/api/token', async (req, res) => {
  const { code } = req.body;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    res.json({
      access_token,
      refresh_token,
    });
  } catch (err) {
    console.error('Error retrieving access token:', err);
    res.status(500).json({ error: 'Failed to retrieve access token', details: err.message });
  }
});



module.exports = router;
