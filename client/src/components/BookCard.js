import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService } from '../services/bookService';
import './BookCard.css';

const BookCard = ({ book, isLibrary = false, onUpdate, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [review, setReview] = useState(book.personalReview || '');
  const [isEditingReview, setIsEditingReview] = useState(false);

  useEffect(() => {
    setReview(book.personalReview || '');
  }, [book.personalReview]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please login to save books');
      return;
    }

    setSaving(true);
    try {
      await bookService.saveBook(book);
      setSaved(true);
      alert('Book saved to your library!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save book';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this book from your library?')) {
      try {
        await bookService.deleteBook(book._id);
        if (onDelete) onDelete(book._id);
      } catch (error) {
        alert('Failed to delete book');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await bookService.updateBook(book._id, {
        readingStatus: newStatus,
      });
      if (onUpdate) onUpdate(updated);
    } catch (error) {
      alert('Failed to update reading status');
    }
  };

  const handleReviewSave = async () => {
    try {
      const updated = await bookService.updateBook(book._id, {
        personalReview: review,
      });
      if (onUpdate) onUpdate(updated);
      setIsEditingReview(false);
    } catch (error) {
      alert('Failed to save review');
    }
  };

  const handleReviewCancel = () => {
    setReview(book.personalReview || '');
    setIsEditingReview(false);
  };

  const truncatedDescription = book.description
    ? book.description.length > 150
      ? book.description.substring(0, 150) + '...'
      : book.description
    : 'No description available';

  return (
    <div className="book-card">
      <div className="book-card-content">
        {book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="book-thumbnail"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          {book.subtitle && <p className="book-subtitle">{book.subtitle}</p>}
          <p className="book-authors">
            by {Array.isArray(book.authors) ? book.authors.join(', ') : 'Unknown Author'}
          </p>
          <p className="book-description">{truncatedDescription}</p>
          
          {isLibrary && (
            <div className="book-library-actions">
              <div className="reading-status">
                <label>Reading Status: </label>
                <select
                  value={book.readingStatus || 'Want to Read'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="personal-review">
                <label>Personal Review:</label>
                {isEditingReview ? (
                  <div className="review-editor">
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Write your review here..."
                      maxLength={1000}
                      rows={4}
                      className="review-textarea"
                    />
                    <div className="review-actions">
                      <button onClick={handleReviewSave} className="save-review-button">
                        Save
                      </button>
                      <button onClick={handleReviewCancel} className="cancel-review-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="review-display">
                    <p className="review-text">
                      {book.personalReview || 'No review yet. Click Edit to add one.'}
                    </p>
                    <button
                      onClick={() => setIsEditingReview(true)}
                      className="edit-review-button"
                    >
                      {book.personalReview ? 'Edit Review' : 'Add Review'}
                    </button>
                  </div>
                )}
              </div>

              <button onClick={handleDelete} className="delete-button">
                Remove from Library
              </button>
            </div>
          )}

          <div className="book-actions">
            {book.infoLink && (
              <a
                href={book.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="view-button"
              >
                View on Google Books
              </a>
            )}
            {!isLibrary && isAuthenticated && (
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className="save-button"
              >
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save to Library'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
