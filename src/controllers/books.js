import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists
} from '../models/books.js';

const isNonemptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidBook = (book) => {
  return book !== null && typeof book === 'object' && !Array.isArray(book) &&
    isNonemptyString(book.authorId) && isNonemptyString(book.title) &&
    isValidDate(book.publicationDate);
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('GET /books failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('GET /books/:id failed:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  if (!isValidBook(req.body) || !isNonemptyString(req.body.id)) {
    return res.status(400).json({ message: 'Invalid book data' });
  }

  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (await getBookById(id)) {
      return res.status(400).json({ message: 'Book id already exists' });
    }

    if (!await authorExists(authorId)) {
      return res.status(400).json({ message: 'Author not found' });
    }

    const book = { id, authorId, title: title.trim(), publicationDate };
    await createBook(book);

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book id already exists' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  if (!isValidBook(req.body)) {
    return res.status(400).json({ message: 'Invalid book data' });
  }

  try {
    const id = req.params.id;

    if (!await getBookById(id)) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { authorId, title, publicationDate } = req.body;

    if (!await authorExists(authorId)) {
      return res.status(400).json({ message: 'Author not found' });
    }

    const book = { authorId, title: title.trim(), publicationDate };
    const result = await updateBook(id, book);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ id, ...book });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
