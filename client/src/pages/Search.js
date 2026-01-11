import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { googleBooksService } from '../services/googleBooksService';
import BookCard from '../components/BookCard';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    freeEbooks: false,
    printType: '', // 'books' or 'magazines' or ''
  });

  const observerTarget = useRef(null);
  const maxResults = 20;

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      setStartIndex(0);
      setBooks([]);
      searchBooks(searchQuery, 0, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const searchBooks = async (searchQuery, start = 0, isNewSearch = false, filtersToUse = null) => {
    if (!searchQuery.trim()) return;

    const activeFilters = filtersToUse !== null ? filtersToUse : filters;

    if (isNewSearch) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const options = {
        maxResults,
        startIndex: start,
      };

      if (activeFilters.freeEbooks) {
        options.filter = 'free-ebooks';
      }

      if (activeFilters.printType) {
        options.printType = activeFilters.printType;
      }

      const result = await googleBooksService.searchBooks(searchQuery, options);
      
      if (isNewSearch) {
        setBooks(result.items);
      } else {
        setBooks((prev) => [...prev, ...result.items]);
      }

      setTotalItems(result.totalItems);
      setStartIndex(start + result.items.length);
      setHasMore(start + result.items.length < result.totalItems);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && query.trim()) {
      searchBooks(query, startIndex, false);
    }
  }, [loadingMore, hasMore, query, startIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setStartIndex(0);
      setBooks([]);
      searchBooks(query, 0, true);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };
    setFilters(newFilters);
    
    if (query.trim()) {
      setStartIndex(0);
      setBooks([]);
      searchBooks(query, 0, true, newFilters);
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

        {query && (
          <div className="search-filters">
            <div className="filter-group">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.freeEbooks}
                  onChange={(e) => handleFilterChange('freeEbooks', e.target.checked)}
                />
                <span>Free E-books Only</span>
              </label>
            </div>
            <div className="filter-group">
              <label className="filter-label">Print Type:</label>
              <select
                value={filters.printType}
                onChange={(e) => handleFilterChange('printType', e.target.value)}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="books">Books</option>
                <option value="magazines">Magazines</option>
              </select>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {loading && (
          <div className="loading">Loading books...</div>
        )}

        {!loading && books.length > 0 && (
          <div className="search-results">
            <h2>Search Results ({totalItems.toLocaleString()} found, showing {books.length})</h2>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.googleBooksId} book={book} />
              ))}
            </div>
            {hasMore && (
              <div ref={observerTarget} className="load-more-trigger">
                {loadingMore && <div className="loading-more">Loading more books...</div>}
              </div>
            )}
          </div>
        )}

        {!loading && books.length === 0 && query && (
          <div className="no-results">
            No books found. Try a different search term or adjust your filters.
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
