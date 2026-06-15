import { createApp } from './server.js';

createApp().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});