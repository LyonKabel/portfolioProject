import React, { useState } from 'react';
import '../Search.css';

const searchSpotify = async (query, type, token) => {
  try {
    const response = await fetch(`/search?query=${query}&type=${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[type + 's'] ? data[type + 's'].items : [];
  } catch (error) {
    console.error('Error fetching Spotify data', error);
    return [];
  }
};

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track'); // Default search type
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem('jwt');
    const results = await searchSpotify(query, searchType, token);

    if (results.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
      setResults(results);
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
          placeholder="Search for songs, artists, albums, or playlists..."
        />
        <select
          className="search-type-selector"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="track">Songs</option>
          <option value="artist">Artists</option>
          <option value="album">Albums</option>
          <option value="playlist">Playlists</option>
        </select>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {noResults && <p className="no-results">No results found.</p>}

      <ul className="results-list">
        {results.map(item => (
          <li key={item.id} className="result-item">
            <a href={item.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {item.name} {item.artists ? `by ${item.artists[0].name}` : ''}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
