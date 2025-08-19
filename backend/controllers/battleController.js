import mongoose from "mongoose";
import Battle from "../models/Battle.js";
import User from "../models/User.js";

export const startOrJoinBattle = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Check if user is already in a pending battle
    const existingBattle = await Battle.findOne({
      isComplete: false,
      "players.user": { $ne: userId }, // exclude self
      $expr: { $lt: [{ $size: "$players" }, 2] }, // less than 2 players
    });
    
    console.log("Battle updated:", existingBattle);

    // 2. Join existing battle if found
    if (existingBattle) {
      existingBattle.players.push({ user: userId });
      if (existingBattle.players.length === 2) {
        existingBattle.isComplete = true;
        existingBattle.startTime = new Date(Date.now() + 10000)
      }
      await existingBattle.save();
      console.log("Battle updated:", existingBattle);

      return res.status(200).json({
        message: "Joined existing battle",
        battle: existingBattle,
      });
    }

    return res.status(404).json({
      message: "No open battles found"
    });
  } catch (error) {
    console.error("Battle error:", error);
    res.status(500).json({ error: "Failed to start/join battle" });
  }
};

export const submitDrawing = async (req, res) => {
  try {
    const userId = req.user._id;
    const { battleId } = req.params;
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Invalid or missing drawing data" });
    }

    const battle = await Battle.findById(battleId);

    if (!battle) return res.status(404).json({ error: "Battle not found" });

    const player = battle.players.find((p) => p.user.toString() === userId.toString());

    if (!player) {
      return res.status(403).json({ error: "You are not part of this battle" });
    }

    if (player.image) {
      return res.status(400).json({ error: "You already submitted your drawing" });
    }

    player.image = image;

    // Check if all players submitted drawings
    const allSubmitted = battle.players.every(p => p.image);

    if (allSubmitted && !battle.votingStartTime) {
      battle.votingStartTime = new Date();
      battle.votingEndTime = new Date(Date.now() +  1 * 60 * 60 * 1000);
    }

    await battle.save();

    res.status(200).json({ message: "Drawing submitted", battle });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Failed to submit drawing" });
  }
};


export const getBattleById = async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id)
      .populate("players.user", "username avatar")
      .populate("themeId");

    if (!battle) return res.status(404).json({ error: "Battle not found" });

    return res.status(200).json({ battle });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Failed to fetch battle" });
  }
};


export const createBattle = async (req, res) => {
  try {
    const userId = req.user._id;
    const themeId = req.body.themeId;

    const newBattle = new Battle({
      themeId,
      players: [{ user: userId }],
    });

    await newBattle.save();

    res.status(201).json({
      message: "Created new battle",
      battle: newBattle,
    });
  } catch (err) {
    console.error("Create battle error:", err);
    res.status(500).json({ error: "Failed to create battle" });
  }
};


export const submitVote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { battleId } = req.params;
    const { votedFor, category } = req.body;

    const battle = await Battle.findById(battleId);

    if (!battle || !battle.isComplete) {
      return res.status(400).json({ error: "Voting not available for this battle." });
    }

    const now = new Date();

    if (!battle.votingStartTime || !battle.votingEndTime) {
      return res.status(400).json({ error: "Voting time not set yet." });
    }

    if (now < battle.votingStartTime) {
      return res.status(400).json({ error: "Voting has not started yet." });
    }

    if (now > battle.votingEndTime) {
      return res.status(400).json({ error: "Voting period has ended." });
    }

    // Prevent duplicate vote per user per category
    const alreadyVoted = battle.votes.find(
      (v) => v.voter.toString() === userId.toString() && v.category === category
    );
    if (alreadyVoted) {
      return res.status(400).json({ error: "You already voted in this category." });
    }

    battle.votes.push({ voter: userId, category, votedFor });

    await battle.save();
    res.status(200).json({ message: "Vote submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit vote" });
  }
};



export const calculateResult = async (req, res) => {
  try {
    const battleId = req.params.battleId.trim();

    // Validate battleId before querying
    if (!mongoose.Types.ObjectId.isValid(battleId)) {
      return res.status(400).json({ error: "Invalid battle ID" });
    }

    const battle = await Battle.findById(battleId).populate("players.user");

    if (!battle || !battle.isComplete) {
      return res.status(400).json({ error: "Battle not ready for result." });
    }

    const voteCounts = {}; // { userId: count }
    for (const vote of battle.votes) {
      const uid = vote.votedFor.toString();
      voteCounts[uid] = (voteCounts[uid] || 0) + 1;
    }

    const [p1, p2] = battle.players;

// Convert to string for comparison
const p1Id = p1.user._id.toString();
const p2Id = p2.user._id.toString();


const p1Votes = voteCounts[p1Id] || 0;
const p2Votes = voteCounts[p2Id] || 0;

if (p1Votes === p2Votes) {
  battle.result = "draw";
} else {
  const winnerId = p1Votes > p2Votes ? p1Id : p2Id;
  const loserId = p1Votes > p2Votes ? p2Id : p1Id;

  battle.result = "win";
  battle.winner = winnerId;

  // Update winner's battlesWon
  await User.findByIdAndUpdate(winnerId, { $inc: { battlesWon: 1 } });

  // Update loser's battlesLost
  await User.findByIdAndUpdate(loserId, { $inc: { battlesLost: 1 } });
}


    // Update battlesPlayed for both players
    await User.updateMany(
  { _id: { $in: [p1.user._id, p2.user._id] } }, // <-- always use ObjectId
  { $inc: { battlesPlayed: 1 } }
);


    await battle.save();
    res.status(200).json({ message: "Result calculated", result: battle.result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate result" });
  }
};


export const joinBattle = async (req, res) => {
  try {
    const userId = req.user._id;
    const { battleId } = req.body;
    
    const battle = await Battle.findById(battleId);
    if (!battle) return res.status(404).json({ error: "Battle not found" });
    
    if (battle.players.find((p) => p.user.toString() === userId.toString())) {
      return res.status(400).json({ error: "You already joined this battle" });
    }
    
    if (battle.players.length >= 2) {
      return res.status(400).json({ error: "Battle is already full" });
    }
    
    battle.players.push({ user: userId });
    
    if (battle.players.length === 2) {
      battle.isComplete = true;
      battle.startTime = new Date(Date.now() + 10000)
    }
    
    await battle.save();
    
    res.status(200).json({
      message: "Joined battle",
      battle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to join battle" });
  }
}


export const openBattle = async (req, res) => {
  try {
    const { themeId } = req.query;

    const query = {
      isComplete: false,
      $expr: { $lt: [{ $size: "$players" }, 2] },
    };

    if (themeId) query.themeId = themeId;

    const openBattles = await Battle.find(query)
      .populate("players.user", "username")
      .populate("themeId", "name");

    res.status(200).json(openBattles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch open battles" });
  }
}


export const getLeaderboard = async (req, res) => {
  try {
    // 1. Get all users sorted by battlesWon descending
    const usersByWins = await User.find({})
      .select("username avatar battlesWon battlesLost battlesPlayed")
      .sort({ battlesWon: -1 })
      .lean();

    // 2. Aggregate funniest votes per user from battles collection
    const funniestVotesAgg = await Battle.aggregate([
      { $unwind: "$votes" },
      { $match: { "votes.category": "funniest" } },  // Only funniest votes
      {
        $group: {
          _id: "$votes.votedFor",      // group by votedFor user ID
          funniestVotesCount: { $sum: 1 }, // count votes
        },
      },
      { $sort: { funniestVotesCount: -1 } },
    ]);

    // 3. Map funny votes counts for quick lookup
    const funniestVotesMap = {};
    funniestVotesAgg.forEach((item) => {
      funniestVotesMap[item._id.toString()] = item.funniestVotesCount;
    });

    // 4. Add funniestVotes count to each user (or 0 if none)
    const leaderboard = usersByWins.map((user) => ({
      ...user,
      funniestVotes: funniestVotesMap[user._id.toString()] || 0,
    }));

    // 5. Optional: sort by battlesWon first, then funniestVotes descending
    leaderboard.sort((a, b) => {
      if (b.battlesWon !== a.battlesWon) {
        return b.battlesWon - a.battlesWon;
      }
      return b.funniestVotes - a.funniestVotes;
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
