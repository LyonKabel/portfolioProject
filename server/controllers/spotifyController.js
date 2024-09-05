const SpotifyWebApi = require('spotify-web-api-node')
const { SpotifyToken } = require('../models/SpotifyToken')

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
  const { query, type } = req.query;
  console.log(SpotifyToken);
  const token = await SpotifyToken.findOne();
  
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' }); // Return an error if no token is found
  }

  if (!query || !type) {
    return res.status(400).json({ error: 'Query and type parameters are required' });
  }

  try {
    // Set the token for the Spotify API
    spotifyApi.setAccessToken(token.access_token); // Set the access token for the API

    // Call the Spotify API with the correct method
    const data = await spotifyApi.search(query, [type]);

   
    if (data.body[type + 's']) {
      res.json(data.body[type + 's'].items); // Return items 
    } else {
      res.status(404).json({ error: 'No results found' });
    }
  } catch (err) {
    console.error('Error fetching data from Spotify:', err); 
    res.status(500).json({ error: 'Failed to fetch data from Spotify', details: err.message });
  }
};



module.exports = {
  login,
  auth,
  status,
  search
};