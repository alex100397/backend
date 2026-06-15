/**
 * Request validation middlewares using Zod schemas.
 */

/**
 * Validate request body against a Zod schema.
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        const validation = schema.safeParse(req.body);
        if (!validation.success) {
            const formatted = validation.error.format();
            const flatError = Object.values(formatted).flatMap(field =>
                field?._errors || []
            );
            const error = flatError.join(', ');
            return res.status(400).json({
                status: 'error',
                message: error || 'Validation failed',
            });
        }
        // Replace body with parsed/transformed data (e.g., trimmed strings, lowercased emails)
        req.body = validation.data;
        next();
    };
};

/**
 * Validate request params against a Zod schema.
 */
export const validateParams = (schema) => {
    return (req, res, next) => {
        const validation = schema.safeParse(req.params);
        if (!validation.success) {
            const formatted = validation.error.format();
            const flatError = Object.values(formatted).flatMap(field =>
                field?._errors || []
            );
            const error = flatError.join(', ');
            return res.status(400).json({
                status: 'error',
                message: error || 'Invalid request parameters',
            });
        }
        req.params = validation.data;
        next();
    };
};