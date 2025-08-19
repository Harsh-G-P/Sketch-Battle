import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const signToken = (id) => {
    //jwt token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

export const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        })
    }

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ msg: 'user already exists' })
        }
        const hashpassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashpassword
        })

        const token = signToken(newUser._id)

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, //prevent XSS attack
            sameSite: "strict", // prevent CRSF attack
            secure: process.env.NODE_ENV === 'production',
        })

        res.status(201).json({
            success: true,
            user: newUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}


export const login = async (req, res) => {
    const {email,password} = req.body

    if(!email || !password){
        res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    try {
        
        const user= await User.findOne({email})
        const isMatch= user && await bcrypt.compare(password,user.password)
        if (!user || !isMatch) return res.status(400).json({success: false, msg: 'Invalid email or password' })

            // AFTER verifying user and password:
if (user.isBanned) {
  if (user.banExpiresAt && new Date() > user.banExpiresAt) {
    // Auto-unban if ban expired
    user.isBanned = false;
    user.banExpiresAt = null;
    user.banReason = "";
    await user.save();
    console.log("User auto-unbanned during login");
  } else {
    return res.status(403).json({
      success: false,
      message: `You are banned until ${user.banExpiresAt?.toLocaleString() || "unknown"}. Reason: ${user.banReason}`,
    });
  }
}


        const token = signToken(user._id)

        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, //prevent XSS attack
            sameSite: "strict", // prevent CRSF attack
            secure: process.env.NODE_ENV === 'production',
        })

        res.status(201).json({
            success: true,
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}


export const logout = async (req, res) => {
    res.clearCookie('jwt')
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}