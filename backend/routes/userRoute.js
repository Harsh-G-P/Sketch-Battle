import express from "express"
import { updateProfile } from "../controllers/userController.js"
import { protectRoute } from "../middleware/auth.js"
import { checkBanMiddleware } from "../middleware/checkBan.js"
const userRoute = express.Router()

userRoute.put('/update',protectRoute,checkBanMiddleware,updateProfile)


export default userRoute