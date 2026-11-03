import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Returns a list of all books stored in MongoDB.
 *     tags:
 *       - Books
 *     responses:
 *       '200':
 *         description: Successfully retrieved all books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: b1
 *                   author:
 *                     type: string
 *                     example: George Orwell
 *                   title:
 *                     type: string
 *                     example: "1984"
 *                   publicationDate:
 *                     type: string
 *                     format: date
 *                     example: "1949-06-08"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Returns a single book matching the provided ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the book.
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       '200':
 *         description: Book retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: b1
 *                 author:
 *                   type: string
 *                   example: George Orwell
 *                 title:
 *                   type: string
 *                   example: "1984"
 *                 publicationDate:
 *                   type: string
 *                   format: date
 *                   example: "1949-06-08"
 *       '400':
 *         description: Invalid book ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid book ID
 *       '404':
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Book not found
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);

export default router;