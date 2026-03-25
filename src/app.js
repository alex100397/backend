import express from 'express';

const app = express(); // create an express app

app.use(express.json()); // middleware to parse JSON bodies

import userRoutes from './routes/user.routes.js';

app.use('api/v1/users', userRoutes); // use the user routes

export default app;