import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    try {
        let token

        // Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized — No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Not authorized — Invalid token"
            })
        }

        const currentUser = await User.findById(decoded.id).select("-password")
        if (!currentUser) {
            return res.status(401).json({ success: false, message: "User not found" })
        }

        req.user = currentUser
        next()
    } catch (error) {
        console.error(error)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Not authorized — Invalid token" })
        }
        res.status(500).json({ success: false, message: "Server Error" })
    }
}
