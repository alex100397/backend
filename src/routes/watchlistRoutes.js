import express from 'express';
import {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getWatchlist,
} from '../controllers/watchlistController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { addToWatchlistSchema, updateWatchlistSchema } from '../validators/watchlistValidator.js';

const router = express.Router();

// All watchlist routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /watchlist:
 *   get:
 *     summary: Get all movies in the watchlist
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: A list of movies in the watchlist
*/
router.get('/', getWatchlist);

/**
 * @swagger
 * /watchlist:
 *   post:
 *     summary: Add a movie to the watchlist
 *     tags: [Watchlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie added to watchlist successfully
*/
router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);

/**
 * @swagger
 * /watchlist/{id}:
 *   put:
 *     summary: Update a movie's status in the watchlist
 *     tags: [Watchlist]
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie status updated successfully
*/
router.put('/:id', validateRequest(updateWatchlistSchema), updateWatchlistStatus);

/**
 * @swagger
 * /watchlist/{id}:
 *   delete:
 *     summary: Remove a movie from the watchlist
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie removed from watchlist successfully
*/
router.delete('/:id', removeFromWatchlist);

export default router;