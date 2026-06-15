import { z } from 'zod';

export const createMovieSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(255, 'Title must be at most 255 characters')
        .trim(),
    description: z.string()
        .min(1, 'Description is required')
        .trim(),
    releaseDate: z.coerce.date({
        required_error: 'Release date is required',
        invalid_type_error: 'Invalid date format',
    }),
    posterUrl: z.string().url('Invalid URL').optional(),
    runTime: z.coerce.number().int().positive('Runtime must be positive').optional(),
    genres: z.array(z.string()).default([]),
});

export const updateMovieSchema = createMovieSchema.partial();

export const movieIdParamSchema = z.object({
    id: z.string().uuid('Invalid movie ID'),
});
