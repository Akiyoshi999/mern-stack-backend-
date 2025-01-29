import mongoose from "mongoose";
import env from "dotenv";
env.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    console.log("MongoDB connection failed");
    throw new Error();
  }
};

export default connectDB;
