import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from './config/database.js';
import { validateEnv } from './config/env.js';
import corsOptions from './config/cors.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

export const createApp = async () => {
    // Validate environment variables before anything else
    validateEnv();

    const app = express();
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';

    // ── Security middlewares ──────────────────────────────────
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(apiLimiter);

    // ── Body parsing middlewares (MUST BE BEFORE ROUTES) ─────
    app.use(express.json({ limit: '10kb' }));          // Limit payload size
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // ── Request logger ───────────────────────────────────────
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
        next();
    });

    // ── Connect to Database ──────────────────────────────────
    await connectDB();

    // ── Health check endpoint ────────────────────────────────
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });

    // ── Swagger API Documentation ────────────────────────────
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // ── API ROUTES (versioned) ───────────────────────────────
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/movies', movieRoutes);
    app.use('/api/v1/watchlist', watchlistRoutes);

    // ── 404 handler for unmatched routes ─────────────────────
    app.use((req, res) => {
        res.status(404).json({
            status: 'error',
            message: `Route ${req.originalUrl} not found`,
        });
    });

    // ── Global error handler (MUST BE LAST) ──────────────────
    app.use(errorHandler);

    // ── Server initialization ────────────────────────────────
    const server = app.listen(PORT, HOST, () => {
        console.log(`🚀 Server is running on ${HOST}:${PORT}`);
        console.log(`📖 Health check: http://${HOST}:${PORT}/health`);
    });

    // ── Graceful shutdown handlers ───────────────────────────
    const gracefulShutdown = (signal) => {
        console.log(`\n${signal} received, shutting down gracefully...`);
        server.close(async () => {
            await disconnectDB();
            console.log('Server closed.');
            process.exit(0);
        });

        // Force close after 10s if graceful shutdown fails
        setTimeout(() => {
            console.error('Forced shutdown — could not close connections in time.');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection:', err);
        gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        gracefulShutdown('uncaughtException');
    });

    return app;
};
