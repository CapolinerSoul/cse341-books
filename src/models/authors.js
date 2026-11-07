import { getDb } from '../db/connect.js';

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();

  return authors;
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id });

  return author;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.insertOne({
    id: author.id,
    name: author.name,
    birthYear: author.birthYear
  });

  return result;
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.updateOne(
    { id },
    { $set: { name: author.name, birthYear: author.birthYear } }
  );

  return result;
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id });

  return result;
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ authorId: id });

  return book !== null;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};
