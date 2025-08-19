import express from "express"
import {  login, logout, register } from "../controllers/authController.js"
import { protectRoute } from "../middleware/auth.js"

const authRoute = express.Router()

authRoute.post('/sign',register)
authRoute.post('/login',login)
authRoute.post('/logout',logout)

authRoute.get('/me',protectRoute,(req,res)=>{
    try {
        res.send({
            success:true,
            user:req.user
        })
    } catch (error) {
        console.log('error')
    }
})


export default authRoute