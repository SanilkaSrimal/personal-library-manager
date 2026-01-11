const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export const googleBooksService = {
  searchBooks: async (query, maxResults = 20) => {
    try {
      const response = await fetch(
        `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
      );
      const data = await response.json();
      
      if (!data.items) {
        return [];
      }

      // Transform Google Books API response to our format
      return data.items.map((item) => {
        const volumeInfo = item.volumeInfo || {};
        return {
          googleBooksId: item.id,
          title: volumeInfo.title || 'No Title',
          subtitle: volumeInfo.subtitle || '',
          authors: volumeInfo.authors || ['Unknown Author'],
          description: volumeInfo.description || '',
          thumbnail: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
          previewLink: volumeInfo.previewLink || '',
          infoLink: volumeInfo.infoLink || '',
        };
      });
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  },
};
