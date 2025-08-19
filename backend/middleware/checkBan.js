// middleware/checkBan.js
import User from "../models/User.js";

export const checkBanMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is in req.user (after auth)
    const user = await User.findById(userId);

    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.isBanned) {
      if (user.banExpiresAt && new Date() > user.banExpiresAt) {
        // Ban expired, auto unban
        user.isBanned = false;
        user.banExpiresAt = null;
        user.banReason = "";
        await user.save();
        
      } else {
        return res.status(403).json({
          message: `You are banned until ${user.banExpiresAt?.toLocaleString() || "unknown"}. Reason: ${user.banReason}`,
        });
      }
    }
    next();
  } catch (error) {
    console.error("Ban check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
