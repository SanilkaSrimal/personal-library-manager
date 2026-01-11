import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">📚 Personal Library Manager</h1>
        <p className="landing-subtitle">
          Discover, save, and manage your favorite books
        </p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search by title, author, or keyword..."
            className="search-input"
            required
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        <div className="landing-features">
          <div className="feature">
            <h3>🔍 Search Books</h3>
            <p>Find books using Google Books API</p>
          </div>
          <div className="feature">
            <h3>💾 Save Books</h3>
            <p>Build your personal library collection</p>
          </div>
          <div className="feature">
            <h3>📖 Track Reading</h3>
            <p>Manage your reading status and reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
