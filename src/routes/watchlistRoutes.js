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

router.get('/', getWatchlist);
router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);
router.put('/:id', validateRequest(updateWatchlistSchema), updateWatchlistStatus);
router.delete('/:id', removeFromWatchlist);

export default router;