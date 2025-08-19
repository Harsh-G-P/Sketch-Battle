import mongoose from "mongoose";
import Battle from "../models/Battle.js";

export const cleanupStaleBattles = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️ Skipping cleanupStaleBattles: MongoDB not connected");
    return;
  }

  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await Battle.deleteMany({
      isComplete: false,
      "players.1": { $exists: false },
      createdAt: { $lt: fiveMinutesAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`[${new Date().toISOString()}] 🧹 Deleted ${result.deletedCount} stale battles`);
    }
  } catch (err) {
    console.error("❌ Failed to cleanup stale battles:", err);
  }
};
