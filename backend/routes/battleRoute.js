import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { calculateResult, createBattle, getBattleById, getLeaderboard, joinBattle, openBattle, startOrJoinBattle, submitDrawing, submitVote } from "../controllers/battleController.js";
import { checkBanMiddleware } from "../middleware/checkBan.js";

const battleRoute = express.Router();

// Try to match with existing battle or create a new one
battleRoute.post("/start", protectRoute,checkBanMiddleware, startOrJoinBattle);

// Submit drawing
battleRoute.post("/:battleId/submit", protectRoute,checkBanMiddleware, submitDrawing);

// Get battle info

battleRoute.post("/create", protectRoute,checkBanMiddleware, createBattle);

// GET /battles/open?themeId=...
// GET /battles/open or /battles/open?themeId=...
battleRoute.get("/open", protectRoute,checkBanMiddleware, openBattle);



// Join specific battle
battleRoute.post("/join", protectRoute,checkBanMiddleware, joinBattle);

battleRoute.post('/:battleId/vote',protectRoute,checkBanMiddleware,submitVote)

battleRoute.post('/:battleId/calculate-result',protectRoute,checkBanMiddleware,calculateResult)

battleRoute.get("/leaderboard", getLeaderboard);


battleRoute.get("/:id", protectRoute,checkBanMiddleware, getBattleById);

export default battleRoute;
