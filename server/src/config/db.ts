import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = () => {
    try {
        mongoose
            .connect(process.env.MONGO_URI as string)
            .then(() => console.log('Database Connected.'))
            .catch(err => console.error('Database connection error:', err));
    } catch (error) {
        console.log("Unable to connect to database.")
    }
}

export default connectDB;