import { prisma } from '../config/database.js';

/**
 * Get a user's watchlist with pagination.
 */
export const getWatchlist = async (userId, { page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        prisma.watchListItem.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        posterUrl: true,
                        releaseDate: true,
                        genres: true,
                    },
                },
            },
        }),
        prisma.watchListItem.count({ where: { userId } }),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Add a movie to a user's watchlist.
 */
export const addToWatchlist = async (userId, { movieId, status, rating, notes }) => {
    // Verify movie exists
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    if (!movie) return { error: 'Movie not found', statusCode: 404 };

    // Check for duplicates
    const existing = await prisma.watchListItem.findFirst({
        where: { movieId, userId },
    });
    if (existing) return { error: 'Movie already in watchlist', statusCode: 409 };

    const upperStatus = status ? status.toUpperCase() : 'PLANNED';

    const item = await prisma.watchListItem.create({
        data: { movieId, userId, status: upperStatus, rating, notes },
    });

    return { data: item };
};

/**
 * Remove a movie from a user's watchlist (ownership-checked).
 */
export const removeFromWatchlist = async (id, userId) => {
    // Ownership check: only delete if item belongs to this user
    const item = await prisma.watchListItem.delete({
        where: { id, userId },
    });
    return item;
};

/**
 * Update a watchlist item (ownership-checked).
 */
export const updateWatchlistItem = async (id, userId, { status, rating, notes }) => {
    const item = await prisma.watchListItem.update({
        where: { id, userId },
        data: { status, rating, notes },
    });
    return item;
};
