const express = require('express');
const router = express.Router();
const {
  getBooks,
  saveBook,
  updateBook,
  deleteBook,
  getBook,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getBooks)
  .post(saveBook);

router.route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
