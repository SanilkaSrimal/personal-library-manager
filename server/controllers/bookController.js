const Book = require('../models/Book');

// @desc    Get all books in user's library
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
};

// @desc    Save a book to user's library
// @route   POST /api/books
// @access  Private
const saveBook = async (req, res) => {
  try {
    const {
      googleBooksId,
      title,
      subtitle,
      authors,
      description,
      thumbnail,
      previewLink,
      infoLink,
    } = req.body;

    // Validation
    if (!googleBooksId || !title) {
      return res.status(400).json({ message: 'Book ID and title are required' });
    }

    // Check if book already exists in user's library
    const existingBook = await Book.findOne({
      user: req.user._id,
      googleBooksId,
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Book already in your library' });
    }

    // Create book
    const book = await Book.create({
      user: req.user._id,
      googleBooksId,
      title,
      subtitle: subtitle || '',
      authors: authors || [],
      description: description || '',
      thumbnail: thumbnail || '',
      previewLink: previewLink || '',
      infoLink: infoLink || '',
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Save book error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book already in your library' });
    }
    res.status(500).json({ message: 'Server error saving book' });
  }
};

// @desc    Update a book in user's library
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { readingStatus, personalReview } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    // Update fields
    if (readingStatus) {
      book.readingStatus = readingStatus;
    }
    if (personalReview !== undefined) {
      book.personalReview = personalReview;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error updating book' });
  }
};

// @desc    Delete a book from user's library
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed from library' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error deleting book' });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify ownership
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this book' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error fetching book' });
  }
};

module.exports = {
  getBooks,
  saveBook,
  updateBook,
  deleteBook,
  getBook,
};
