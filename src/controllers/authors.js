import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthor = async (req, res) => {
  const { id, name, birthYear } = req.body || {};

  if (
    typeof id !== 'string' || !id.trim() ||
    typeof name !== 'string' || !name.trim() ||
    !Number.isInteger(birthYear)
  ) {
    return res.status(400).json({ message: 'Invalid author data' });
  }

  try {
    const existingAuthor = await getAuthorByIdFromDb(id);

    if (existingAuthor) {
      return res.status(400).json({ message: 'Author id already exists' });
    }

    const author = { id, name: name.trim(), birthYear };
    await createAuthorInDb(author);

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Author id already exists' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthor = async (req, res) => {
  const { name, birthYear } = req.body || {};

  if (
    typeof name !== 'string' || !name.trim() ||
    !Number.isInteger(birthYear)
  ) {
    return res.status(400).json({ message: 'Invalid author data' });
  }

  try {
    const id = req.params.id;
    const author = { name: name.trim(), birthYear };
    const result = await updateAuthorInDb(id, author);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json({ id, ...author });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await authorHasBooks(id)) {
      return res.status(409).json({ message: 'Cannot delete author with existing books' });
    }

    const result = await deleteAuthorFromDb(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
