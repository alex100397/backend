import express from 'express';
import {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
} from '../controllers/movieController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateRequest, validateParams } from '../middlewares/validateRequest.js';
import { createMovieSchema, updateMovieSchema, movieIdParamSchema } from '../validators/movieValidator.js';

const router = express.Router();

// Public routes

/**
 * @swagger
 * /movies:
*   get:
*     summary: Get all movies
*     tags: [Movies]
*     responses:
*       200:
*         description: A list of movies
*/
router.get('/', getMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single movie object
 */
router.get('/:id', validateParams(movieIdParamSchema), getMovie);

// Protected routes (must be logged in)

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 */
router.post('/', authMiddleware, validateRequest(createMovieSchema), createMovie);

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 */
router.put('/:id', authMiddleware, validateParams(movieIdParamSchema), validateRequest(updateMovieSchema), updateMovie);

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */
router.delete('/:id', authMiddleware, validateParams(movieIdParamSchema), deleteMovie);

export default router;