import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

export const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' })

        const hashpassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, password: hashpassword })

        const token = signToken(newUser._id)

        res.status(201).json({
            success: true,
            user: newUser,
            token // return token in JSON
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" })
    }

    try {
        const user = await User.findOne({ email })
        const isMatch = user && await bcrypt.compare(password, user.password)
        if (!user || !isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' })

        // handle banned users
        if (user.isBanned) {
            if (user.banExpiresAt && new Date() > user.banExpiresAt) {
                user.isBanned = false
                user.banExpiresAt = null
                user.banReason = ""
                await user.save()
            } else {
                return res.status(403).json({
                    success: false,
                    message: `You are banned until ${user.banExpiresAt?.toLocaleString() || "unknown"}. Reason: ${user.banReason}`,
                })
            }
        }

        const token = signToken(user._id)

        res.status(200).json({
            success: true,
            user,
            token // return token in JSON
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const logout = async (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" })
}
