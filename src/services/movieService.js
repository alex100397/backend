import { prisma } from '../config/database.js';

/**
 * Get all movies with pagination.
 */
export const getAllMovies = async ({ page = 1, limit = 20 }) => {
    const skip = (page - 1) * limit;

    const [movies, total] = await Promise.all([
        prisma.movie.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: { id: true, name: true },
                },
            },
        }),
        prisma.movie.count(),
    ]);

    return {
        movies,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a single movie by ID.
 */
export const getMovieById = async (id) => {
    return prisma.movie.findUnique({
        where: { id },
        include: {
            creator: {
                select: { id: true, name: true },
            },
        },
    });
};

/**
 * Create a new movie.
 */
export const createMovie = async (data, createdBy) => {
    return prisma.movie.create({
        data: { ...data, createdBy },
    });
};

/**
 * Update a movie (only if owned by the user).
 */
export const updateMovie = async (id, data, userId) => {
    return prisma.movie.update({
        where: { id, createdBy: userId },
        data,
    });
};

/**
 * Delete a movie (only if owned by the user).
 */
export const deleteMovie = async (id, userId) => {
    return prisma.movie.delete({
        where: { id, createdBy: userId },
    });
};
