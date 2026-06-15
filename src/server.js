import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB, disconnectDB } from './config/database.js';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

export const createApp = () => {

    const app = express();
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "[IP_ADDRESS]" || '0.0.0.0';

    // Request logger
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // Connect to Database
    connectDB();

    // Body parsing middlewares (MUST BE BEFORE ROUTES)
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // API ROUTES
    app.use('/auth', authRoutes);
    app.use('/movies', movieRoutes);
    app.use('/watchlist', watchlistRoutes);

    // Server initialization
    const server = app.listen(PORT, HOST, () => {
        console.log(`Server is running on ${HOST}:${PORT}`);
    });

    // Error handling and graceful shutdown
    process.on('unhandledRejection', (err) => {
        console.error(`Unhandled Rejection: ${err.message}`);
        server.close(async () => {
            await disconnectDB();
            process.exit(1);
        });
    });

    process.on('uncaughtException', (err) => {
        console.error(`Uncaught Exception: ${err.message}`);
        server.close(async () => {
            await disconnectDB();
            process.exit(1);
        });
    });

    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully...');
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    })

    return app;

};
