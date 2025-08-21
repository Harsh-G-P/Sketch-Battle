import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
    try {
        let token

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized — No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        req.user = user
        next()
    } catch (err) {
        console.error(err)
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Invalid token" })
        }
        res.status(500).json({ success: false, message: "Server error" })
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Access denied — Admins only" })
    }
    next()
}
