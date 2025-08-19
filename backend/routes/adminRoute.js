import express from "express"
import { promoteUserToAdmin, getAllUsers, getAdminStats, deleteUser, reviewVotes, banUser, unbanUser } from "../controllers/adminController.js"
import { protectRoute, isAdmin } from "../middleware/admin.js"

const adminRoute = express.Router()

// GET all users (admin only)
adminRoute.get("/users", protectRoute, isAdmin, getAllUsers)

// PUT promote user to admin
adminRoute.put("/promote/:userId", protectRoute, isAdmin, promoteUserToAdmin)

adminRoute.delete("/user/:userId", protectRoute, isAdmin, deleteUser);

adminRoute.get('/stats',protectRoute, isAdmin , getAdminStats)

adminRoute.get("/battles/:battleId/votes", protectRoute, isAdmin , reviewVotes);

adminRoute.post("/users/:userId/ban", protectRoute, isAdmin, banUser);
adminRoute.post("/users/:userId/unban", protectRoute, isAdmin, unbanUser);

export default adminRoute
