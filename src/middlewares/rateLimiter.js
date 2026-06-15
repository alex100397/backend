import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
    },
});

/**
 * Stricter limiter for auth endpoints — 20 requests per 15 minutes per IP.
 * Prevents brute-force login / credential-stuffing attacks.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many login attempts, please try again later.',
    },
});
