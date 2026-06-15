import * as movieService from '../services/movieService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * GET /api/v1/movies?page=1&limit=20
 */
export const getMovies = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Cap at 100

        const result = await movieService.getAllMovies({ page, limit });
        sendSuccess(res, result, 'Movies fetched successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/v1/movies/:id
 */
export const getMovie = async (req, res, next) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) return sendError(res, 'Movie not found', 404);

        sendSuccess(res, { movie }, 'Movie fetched successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/v1/movies  (authenticated)
 */
export const createMovie = async (req, res, next) => {
    try {
        const movie = await movieService.createMovie(req.body, req.user.id);
        sendSuccess(res, { movie }, 'Movie created successfully', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/v1/movies/:id  (authenticated, owner only)
 */
export const updateMovie = async (req, res, next) => {
    try {
        const movie = await movieService.updateMovie(req.params.id, req.body, req.user.id);
        sendSuccess(res, { movie }, 'Movie updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/v1/movies/:id  (authenticated, owner only)
 */
export const deleteMovie = async (req, res, next) => {
    try {
        await movieService.deleteMovie(req.params.id, req.user.id);
        sendSuccess(res, null, 'Movie deleted successfully');
    } catch (error) {
        next(error);
    }
};
