import express from "express";
import {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getWatchlist
} from "../controllers/watchlistController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidator.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', validateRequest(addToWatchlistSchema), getWatchlist);

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);

router.delete('/:id', validateRequest(addToWatchlistSchema), removeFromWatchlist);

router.put('/:id', validateRequest(addToWatchlistSchema), updateWatchlistStatus);

export default router;