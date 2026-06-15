import { z } from 'zod';

const addToWatchlistSchema = z.object({
    movieId: z.string().uuid(),
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
        error: () => `Invalid status. Allowed values: ${["PLANNED", "WATCHING", "COMPLETED", "DROPPED"].join(", ")}`
    }).optional(),
    rating: z.coerce.number().int("Rating must be a whole number").min(1, "Rating must be at least 1").max(10, "Rating must be at most 10").optional(),
    notes: z.string().optional()
})

export { addToWatchlistSchema };
