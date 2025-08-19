import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized — No token" })
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
    return res.status(401).json({ success: false, message: "Not authorized — Invalid token" })
  }
}

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied — Admins only" })
  }
  next()
}
