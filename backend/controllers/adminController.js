import Battle from "../models/Battle.js"
import User from "../models/User.js"

export const promoteUserToAdmin = async (req, res) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "User is already an admin" })
    }

    user.role = "admin"
    await user.save()

    res.status(200).json({ success: true, message: `${user.username} promoted to admin` })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, users })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBattles = await Battle.countDocuments();

    const totalWins = await Battle.countDocuments({ result: 'win' });
    const totalDraws = await Battle.countDocuments({ result: 'draw' });
    const totalLosses = totalWins;

    // Fetch all battles, get total drawings submitted by counting players with images
    const battles = await Battle.find({}, 'players');

    let totalDrawingsSubmitted = 0;
    battles.forEach(battle => {
      totalDrawingsSubmitted += battle.players.filter(player => player.image).length;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBattles,
        totalWins,
        totalLosses,
        totalDraws,
        totalDrawingsSubmitted,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();

    res.status(200).json({ success: true, message: `${user.username} has been deleted` });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export const reviewVotes = async (req, res) => {
  try {
    const { battleId } = req.params;

    if (!battleId) {
      return res.status(400).json({ message: "Battle ID is required" });
    }

    // Find battle by ID and populate voters, votedFor users and players
    const battle = await Battle.findById(battleId)
      .populate("votes.voter", "username avatar")
      .populate("votes.votedFor", "username avatar")
      .populate("players.user", "username avatar")
    if (!battle) {
      return res.status(404).json({ message: "Battle not found" });
    }

    // Format votes by category
    const votesByCategory = {};

    for (const vote of battle.votes) {
      const category = vote.category || "uncategorized";

      if (!votesByCategory[category]) {
        votesByCategory[category] = [];
      }

      // Only push vote if both voter and votedFor are populated
      if (vote.voter && vote.votedFor) {
        votesByCategory[category].push({
          voter: {
            username: vote.voter.username,
            avatar: vote.voter.avatar,
          },
          votedFor: {
            username: vote.votedFor.username,
            avatar: vote.votedFor.avatar,
          },
        });
      }
    }

    // Format players array for frontend
    const players = battle.players.map((p) => ({
      username: p.user.username,
      avatar: p.user.avatar,
      drawing: p.image
    }));

    res.json({
      battleId: battle._id,
      players,
      votes: votesByCategory,
    });
  } catch (err) {
    console.error("Vote review error:", err);
    res.status(500).json({ message: "Server error while fetching vote review" });
  }
};

export const banUser = async (req, res) => {
  const { userId } = req.params;
  const { days, reason } = req.body; // days is number of days to ban

  if (!days || days <= 0) {
    return res.status(400).json({ success: false, message: "Invalid ban duration" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBanned = true;
    user.banExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    user.banReason = reason || "No reason provided";

    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.username} has been banned for ${days} day(s).`,
      banExpiresAt: user.banExpiresAt,
    });
  } catch (err) {
    console.error("Ban user error:", err);
    res.status(500).json({ success: false, message: "Server error banning user" });
  }
};

export const unbanUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBanned = false;
    user.banExpiresAt = null;
    user.banReason = "";

    await user.save();

    res.status(200).json({ success: true, message: `${user.username} has been unbanned.` });
  } catch (err) {
    console.error("Unban user error:", err);
    res.status(500).json({ success: false, message: "Server error unbanning user" });
  }
};
