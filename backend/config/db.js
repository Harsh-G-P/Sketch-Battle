import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB, {
      serverSelectionTimeoutMS: 10000, // 10 seconds for quicker failover
      socketTimeoutMS: 45000,          // network inactivity timeout
      maxPoolSize: 10,                 // limit concurrent connections
    });

    console.log("✅ MongoDB connected");

    // Optional listeners for connection issues
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
