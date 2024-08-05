import mongoose from "mongoose";

const connectToDatabase = async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  console.log("Connected to database");
};

export default connectToDatabase;
