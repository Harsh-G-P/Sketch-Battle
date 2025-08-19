import cloudinary from "../config/cloudinary.js"
import User from "../models/User.js"


export const updateProfile = async(req,res)=>{
    try {
        const {avatar, ...otherData} = req.body
        let updatedData =otherData
        if(avatar){
            if(avatar.startsWith('data:image')){
                try {
                    const uploadResponse = await cloudinary.uploader.upload(avatar)
                    updatedData.avatar = uploadResponse.secure_url
                } catch (error) {
                    return res.status(400).json({
                    success:false,
                    message:"Error uploading image. Profile update aborted."
                    })
                }
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id,updatedData,{new:true})
        res.status(200).json({
        success:true,
        user:updatedUser
       })
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}