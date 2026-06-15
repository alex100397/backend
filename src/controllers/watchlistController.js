import * as watchlistService from '../services/watchlistService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * POST /api/v1/watchlist
 */
const addToWatchlist = async (req, res, next) => {
    try {
        const { movieId, status, rating, notes } = req.body;

        const result = await watchlistService.addToWatchlist(req.user.id, {
            movieId, status, rating, notes,
        });

        if (result.error) {
            return sendError(res, result.error, result.statusCode);
        }

        sendSuccess(res, { watchlistItem: result.data }, 'Movie added to watchlist successfully', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/v1/watchlist/:id
 */
const removeFromWatchlist = async (req, res, next) => {
    try {
        const watchlistItem = await watchlistService.removeFromWatchlist(
            req.params.id,
            req.user.id, // Ownership check
        );
        sendSuccess(res, { watchlistItem }, 'Movie removed from watchlist successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/v1/watchlist/:id
 */
const updateWatchlistStatus = async (req, res, next) => {
    try {
        const { status, rating, notes } = req.body;
        const watchlistItem = await watchlistService.updateWatchlistItem(
            req.params.id,
            req.user.id, // Ownership check
            { status, rating, notes },
        );
        sendSuccess(res, { watchlistItem }, 'Watchlist item updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/v1/watchlist?page=1&limit=20
 */
const getWatchlist = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);

        const result = await watchlistService.getWatchlist(req.user.id, { page, limit });
        sendSuccess(res, result, 'Watchlist fetched successfully');
    } catch (error) {
        next(error);
    }
};

export {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getWatchlist,
};