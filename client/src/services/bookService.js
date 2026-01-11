import api from '../api/axios';

export const bookService = {
  getBooks: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  saveBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  updateBook: async (bookId, updates) => {
    const response = await api.put(`/books/${bookId}`, updates);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await api.delete(`/books/${bookId}`);
    return response.data;
  },

  getBook: async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  },
};
