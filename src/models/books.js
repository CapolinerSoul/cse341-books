import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.insertOne({
    id: book.id,
    authorId: book.authorId,
    title: book.title,
    publicationDate: book.publicationDate
  });

  return result;
};

const updateBook = async (id, book) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.updateOne(
    { id },
    { $set: {
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate
    } }
  );

  return result;
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id });

  return result;
};

const authorExists = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id });

  return author !== null;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists };
