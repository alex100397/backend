import { z } from 'zod';

export const addToWatchlistSchema = z.object({
    movieId: z.string().uuid('Invalid movie ID'),
    status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
        error: () => `Invalid status. Allowed values: PLANNED, WATCHING, COMPLETED, DROPPED`,
    }).optional(),
    rating: z.coerce.number()
        .int('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(10, 'Rating must be at most 10')
        .optional(),
    notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
});

export const updateWatchlistSchema = z.object({
    status: z.enum(['PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED'], {
        error: () => `Invalid status. Allowed values: PLANNED, WATCHING, COMPLETED, DROPPED`,
    }).optional(),
    rating: z.coerce.number()
        .int('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(10, 'Rating must be at most 10')
        .optional(),
    notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
});
