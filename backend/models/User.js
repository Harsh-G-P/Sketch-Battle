import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    battlesPlayed: {
        type: Number,
        default: 0,
    },
    battlesWon: {
        type: Number,
        default: 0,
    },
    battlesLost: {
        type: Number,
        default: 0,
    },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBanned: { type: Boolean, default: false },
  banExpiresAt: { type: Date, default: null },
  banReason: { type: String, default: "" },

}, { timestamps: true })

export default mongoose.models.User || mongoose.model("User", userSchema)