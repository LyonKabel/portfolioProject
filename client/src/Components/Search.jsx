import React, { useState } from 'react';
import '../Search.css'; 

const searchSongs = async (query, token) => {
  const response = await fetch(`/search?query=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.tracks ? data.tracks.items : [];
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem('jwt');
    const results = await searchSongs(query, token);

    if (results.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      setSongs(results);
    }
  };

  return (
    <div className="search-page">
      <div className="search-form-container">
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {noResults && <p className="no-results">No results found.</p>}

      <ul className="song-list">
        {songs.map(song => (
          <li key={song.id} className="song-item">
            <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {song.name} by {song.artists[0].name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
