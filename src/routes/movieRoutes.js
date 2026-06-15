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
router.get('/', getMovies);
router.get('/:id', validateParams(movieIdParamSchema), getMovie);

// Protected routes (must be logged in)
router.post('/', authMiddleware, validateRequest(createMovieSchema), createMovie);
router.put('/:id', authMiddleware, validateParams(movieIdParamSchema), validateRequest(updateMovieSchema), updateMovie);
router.delete('/:id', authMiddleware, validateParams(movieIdParamSchema), deleteMovie);

export default router;