import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["weirdest", "funniest", "saddest"], required: true },
  votedFor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String }, // base64 or image URL
});

const battleSchema = new mongoose.Schema(
  {
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    players: [playerSchema], // max 2
    isComplete: { type: Boolean, default: false },
    startTime: { type: Date },
    votes: [voteSchema],
    votingStartTime: { type: Date, default: null },
    votingEndTime: { type: Date, default: null },
    result: {
      type: String,
      enum: ["win", "lose", "draw"],
      default: null,
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Battle", battleSchema);
