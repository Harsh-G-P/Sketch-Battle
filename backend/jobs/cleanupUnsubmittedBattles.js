import mongoose from "mongoose";
import Battle from "../models/Battle.js";

export const cleanupUnsubmittedBattles = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.warn("⚠️ Skipping cleanupUnsubmittedBattles: MongoDB not connected");
    return;
  }

  try {
    const DELETE_DELAY_MS = 30 * 1000;
    const now = new Date();

    const result = await Battle.deleteMany({
      isComplete: true,
      startTime: { $lt: new Date(now.getTime() - DELETE_DELAY_MS) },
      $expr: {
        $and: [
          { $eq: [{ $size: "$players" }, 2] },
          {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$players",
                    as: "p",
                    cond: { $not: ["$$p.image"] },
                  },
                },
              },
              0,
            ],
          },
        ],
      },
    });

    if (result.deletedCount > 0) {
      console.log(`[${new Date().toISOString()}] 🧹 Deleted ${result.deletedCount} battles with unsubmitted drawings`);
    }
  } catch (err) {
    console.error("❌ Failed to cleanup unsubmitted battles:", err);
  }
};
