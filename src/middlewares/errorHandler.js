/**
 * Global error-handling middleware.
 * Must be registered LAST (after all routes).
 * Express identifies error handlers by the 4-parameter signature.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    // Prisma known-error codes
    if (err.code === 'P2002') {
        return res.status(409).json({
            status: 'error',
            message: 'A record with that value already exists.',
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            status: 'error',
            message: 'Record not found.',
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token.',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token expired.',
        });
    }

    // Zod validation errors (in case they bubble up)
    if (err.name === 'ZodError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed.',
            errors: err.errors,
        });
    }

    // Default
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal server error',
    });
};

export default errorHandler;
