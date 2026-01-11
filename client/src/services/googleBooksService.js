const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export const googleBooksService = {
  searchBooks: async (query, options = {}) => {
    try {
      const {
        maxResults = 20,
        startIndex = 0,
        filter = null, // 'free-ebooks' or 'paid-ebooks'
        printType = null, // 'books' or 'magazines'
      } = options;

      let url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`;

      // Add filters if provided
      if (filter) {
        url += `&filter=${filter}`;
      }
      if (printType) {
        url += `&printType=${printType}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items) {
        return {
          items: [],
          totalItems: data.totalItems || 0,
        };
      }

      // Transform Google Books API response to our format
      const items = data.items.map((item) => {
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
          printType: volumeInfo.printType || '',
          saleInfo: item.saleInfo || {},
        };
      });

      return {
        items,
        totalItems: data.totalItems || 0,
      };
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  },
};
