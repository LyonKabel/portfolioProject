import React, { useState } from 'react';
import '../Search.css';
import LogoutButton from './LogoutButton'; // Import the LogoutButton

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ albums: [], tracks: [], artists: [] });
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem('jwt');
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${query}&type=album,artist,track`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="search-page">
      <LogoutButton /> {/* Add Logout Button here */}
      <div className="search-form-container">
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="no-results">{error}</p>}

      {!error && (
        <div className="results-container" style={{ display: 'flex' }}>
          <div className="results" style={{ flex: 3 }}>
            <div className="section">
              <h2>Albums</h2>
              <div className="results-grid">
                {results.albums.slice(0, 3).map((album) => (
                  <a key={album.id} href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="result-item">
                    <img src={album.images[0]?.url} alt={album.name} className="result-image" />
                    <div className="result-info">
                      <p>{album.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Tracks</h2>
              <div className="results-grid">
                {results.tracks.slice(0, 3).map((track) => (
                  <a key={track.id} href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="result-item">
                    <img src={track.album.images[0]?.url} alt={track.name} className="result-image" />
                    <div className="result-info">
                      <p>{track.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Artists</h2>
              <div className="results-grid">
                {results.artists.slice(0, 3).map((artist) => (
                  <a key={artist.id} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="result-item">
                    <img src={artist.images[0]?.url} alt={artist.name} className="result-image" />
                    <div className="result-info">
                      <p>{artist.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
