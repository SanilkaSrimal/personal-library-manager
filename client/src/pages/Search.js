import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';
import BookCard from '../components/BookCard';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      searchBooks(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const searchBooks = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const results = await googleBooksService.searchBooks(searchQuery);
      setBooks(results);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      searchBooks(query);
    }
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1>Search Books</h1>
        <form onSubmit={handleSubmit} className="search-form-page">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or keyword..."
            className="search-input-page"
          />
          <button type="submit" className="search-button-page" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading">Loading books...</div>
        )}

        {!loading && books.length > 0 && (
          <div className="search-results">
            <h2>Search Results ({books.length})</h2>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.googleBooksId} book={book} />
              ))}
            </div>
          </div>
        )}

        {!loading && books.length === 0 && query && (
          <div className="no-results">
            No books found. Try a different search term.
          </div>
        )}

        {!loading && !query && (
          <div className="search-prompt">
            Enter a search term above to find books
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
