const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  googleBooksId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  authors: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  previewLink: {
    type: String,
    default: '',
  },
  infoLink: {
    type: String,
    default: '',
  },
  readingStatus: {
    type: String,
    enum: ['Reading', 'Completed', 'Want to Read'],
    default: 'Want to Read',
  },
  personalReview: {
    type: String,
    default: '',
    maxlength: [1000, 'Review cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
});

// Ensure a user can't save the same book twice
bookSchema.index({ user: 1, googleBooksId: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);
