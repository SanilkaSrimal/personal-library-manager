import React, { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import './Library.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load your library');
      console.error('Load books error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book._id === updatedBook._id ? updatedBook : book
      )
    );
  };

  const handleDelete = (bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
  };

  if (loading) {
    return (
      <div className="library-page">
        <div className="loading">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-container">
        <h1>My Library</h1>
        
        {error && <div className="error-message">{error}</div>}

        {books.length === 0 ? (
          <div className="empty-library">
            <p>Your library is empty.</p>
            <p>Start by searching for books and saving them to your library!</p>
          </div>
        ) : (
          <div className="library-stats">
            <p>You have {books.length} book{books.length !== 1 ? 's' : ''} in your library</p>
          </div>
        )}

        <div className="books-list">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              isLibrary={true}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
