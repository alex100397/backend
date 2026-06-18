/**
 * CORS configuration.
 * Allows the frontend origin to make credentialed requests.
 */
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5001',
    credentials: true, // Required for cookies (JWT HttpOnly)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
