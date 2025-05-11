import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  // Если база данных уже подключена, то не снова не подключай её
  if (connected) {
    console.log("MongoDB уже подключена...");
    return;
  }

  // Подключение к MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB подключена...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
