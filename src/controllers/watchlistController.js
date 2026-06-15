import { prisma } from '../config/database.js'

const addToWatchlist = async (req, res) => {
    try {
        console.log("Raw request body:", req.body);

        const { movieId, status, rating, notes } = req.body

        if (!movieId) {
            return res.status(400).json({
                message: "movieId is required",
                receivedBody: req.body
            });
        }

        //Verify movie exists
        const movie = await prisma.movie.findUnique({ where: { id: movieId } })
        if (!movie) return res.status(404).json({ message: "Movie not found" })

        //Check if already added
        const existingWatchlist = await prisma.watchListItem.findFirst({
            where: {
                movieId: movieId,
                userId: req.user.id,
            }
        })
        if (existingWatchlist) return res.status(400).json({ message: "Movie already added to watchlist" })

        // Ensure status is valid according to the Prisma enum WatchListStatus
        // The enum has PLANNED, WATCHING, COMPLETED, DROPPED.
        const upperStatus = status ? status.toUpperCase() : 'PLANNED';

        const watchlistItem = await prisma.watchListItem.create({
            data: {
                movieId,
                userId: req.user.id,
                status: upperStatus,
                rating,
                notes
            }
        })
        res.status(200).json({
            message: "Movie added to watchlist successfully",
            data: {
                watchlistItem
            }
        })

    } catch (error) {
        console.error("Error in addToWatchlist:", error);
        res.status(500).json({ message: "Failed to add stock to watchlist", error: error.message });
    }
}

const removeFromWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const watchlistItem = await prisma.watchListItem.delete({
            where: {
                id: id,
            }
        })
        res.status(200).json({ message: "Movie removed from watchlist successfully", data: { watchlistItem } })
    } catch (error) {
        res.status(500).json({ message: "Failed to remove movie from watchlist", error: error.message });
    }
}

const updateWatchlistStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rating, notes } = req.body;
        const watchlistItem = await prisma.watchListItem.update({
            where: {
                id: id,
            },
            data: {
                status,
                rating,
                notes
            }
        })
        res.status(200).json({ message: "Movie watchlist status updated successfully", data: { watchlistItem } })
    } catch (error) {
        res.status(500).json({ message: "Failed to update movie watchlist status", error: error.message });
    }
}

const getWatchlist = async (req, res) => {
    try {
        const watchlistItem = await prisma.watchListItem.findMany({
            where: {
                userId: req.user.id,
            }
        })
        res.status(200).json({ message: "Movie watchlist fetched successfully", data: { watchlistItem } })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movie watchlist", error: error.message });
    }
}


export {
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistStatus,
    getWatchlist
}