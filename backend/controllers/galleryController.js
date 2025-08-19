// controllers/galleryController.js
import Battle from "../models/Battle.js";

export const getCompletedBattles = async (req, res) => {
  try {
    const { themeId, dateFrom, dateTo, result } = req.query;

    // Build a filter query
    let filter = { isComplete: true };

    if (themeId) filter.themeId = themeId;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    // Add result filter logic if you have battle results stored

    const battles = await Battle.find(filter)
      .populate("players.user", "username avatar")
      .populate("themeId")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ battles });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({ error: "Failed to fetch gallery battles" });
  }
};
