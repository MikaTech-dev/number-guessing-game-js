import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async (PORT) => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`📜 Mongodb conncected: http://${conn.connection.host}`);
        return conn;
    }catch (err) {
        console.error("AN error occured connecting to the database", err);
        process.exit(1);
    }
};

export default connectDB;