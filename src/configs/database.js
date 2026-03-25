import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGOBD_URI);
        console.log(connectionInstance, 'inst')
    } catch (error) {
        console.log(error, 'err');
        process.exit(1);
    }
}

export default connectDB;