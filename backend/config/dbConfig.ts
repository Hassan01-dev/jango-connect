import mongoose from "mongoose";

const connectionString = process.env.ATLAS_URI || '';

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(connectionString);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    // Exit the process on any connection error
    process.exit(1);
  }
};

export default connectDB;
