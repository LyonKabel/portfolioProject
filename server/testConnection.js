// Search function
const search = async (req, res) => {
  const { query, type } = req.query; // Get query and type from the query parameters

  // Check if both query and type are provided
  if (!query || !type) {
    return res.status(400).json({ error: 'Query and type parameter are required' });
  
  }

  try {
    // Perform the search using the Spotify API
    const data = await spotifyApi.search(query, [type]);
    

    // Return the relevant items based on the type
    res.json(data.body[type + 's'] || []); // Ensure it returns the correct structure
  } catch (error) {
    console.error('Error fetching from Spotify:', error);
    res.status(500).json({ error: 'Failed to fetch data from Spotify' });
  }
};