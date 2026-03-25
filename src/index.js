import dotenv from 'dotenv';
import connectDB from './configs/database.js';
import app from './app.js';
dotenv.config({
    path: './.env'
});

const startServer = async() => {
    try {
        console.log('Server started');
        await connectDB();
        app.on('error', (error) => {
            console.log(error, 'err');
        });
        app.listn(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error, 'err');
    }
}

startServer();