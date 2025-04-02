import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import genrateAccessToken from "../utils/genrateAccessToken.js";
import genrateRefereshToken from "../utils/genrateRefereshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import upload from "../middleware/multer.js";
import genratedOtp from "../utils/genrateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export async function registerUserController(req,res){
    try {
        const {email,password,name} = req.body;
        if(!email||!password||!name)
        {
            return res.status(400).json({
                message:"Please provide all the details",
                error:true,
                success:false
            })
        }

        const user = await UserModel.findOne({email});
        if(user)
        {
            return res.status(400).json({
                message:"Email already exists",
                error:true,
                success:false
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        // const hash = hashPassword.toString();
        const newUser = new UserModel({
            email,
            password:hashPassword,
            name
        });
        await newUser.save();


        const verifyEmailUrl=`${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`;
        
        try {
            const verifyEmail = await sendEmail({
                sendTo: email,
                subject: "Verification email from BlinkYT",
                html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
            });
        
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }
        

        return res.json({
            message:"User registered successfully",
            error:false,
            success:true,
            data:{
                user:newUser
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
    
}

export async function verifyEmailController(req,res){
    try {
        const {code} = req.query;
        if(!code)
        {
            return res.status(400).json({
                message:"Please provide code",
                error:true,
                success:false
            })
        }
        const user = await UserModel.findOne({_id:code});
        if(!user)
        {
            return res.status(400).json({
                message:"User not found",
                error:true,
                success:false
            })
        }
        const updateUser= await UserModel.updateOne({_id:user},{
            verifyEmail:true
        })

        return res.json({
            message:"Email verified successfully",
            error:false,
            success:true,
            data:{
                user:updateUser
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
    
}
//Login Controller
export async function loginUserController(req,res){
    try {


        const {email,password} = req.body;
        if(!email||!password)
        {
            return res.status(400).json({
                message:"Please provide all the details",
                error:true,
                success:false
            })
        }



        const user = await UserModel.findOne({email});
        if(!user)
        {
            return res.status(400).json({
                message:"User not found",
                error:true,
                success:false
            })
        }

        if(user.stauts !== "active")
        {
            return res.status(400).json({
                message:"User is not active please contact admin",
                error:true,
                success:false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch)
        {
            return res.status(400).json({
                message:"Invalid password",
                error:true,
                success:false
            })
        }

        const accessToken=await genrateAccessToken(user._id);
        const refreshToken=await genrateRefereshToken(user._id);
        

        const cookiesOption={
            httpOnly:true,
            secure:true,
            "sameSite":"none"
        }
        res.cookie('accessToken',accessToken,cookiesOption);
        res.cookie('refreshToken',refreshToken,cookiesOption);

       return res.json({
            message:"User logged in successfully",
            error:false,
            success:true,
            data:{
                accessToken,
                refreshToken
            }
        })


        
    } catch (error) {
        return res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
    
}
//Logout Controller
export async function logoutUserController(req,res){
    try {
        const userId=req.userId;
        const cookiesOption={
            httpOnly:true,
            secure:true,
            "sameSite":"none"
        }
        res.clearCookie("accessToken",cookiesOption);
        res.clearCookie("refreshToken",cookiesOption);
        const removeRefreshToken = await UserModel.updateOne(
            {_id:userId},{
                refrteshToken:""
            }
        );
        return res.json({
            message:"User logged out successfully",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
    
}
//Upload User Avatar
export async function uploadUserAvatarController(req,res){
    try {
        const userId = req.userId // auth middlware
        const image = req.file  // multer middleware

        const upload = await uploadImageCloudinary(image)
        if (!upload || !upload.url) {
            return res.status(500).json({
                message: "Image upload failed",
                success: false,
                error: true
            });
        }

        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })
        if (!updateUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }
        return res.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
    
}
//Update user details
export async function updateUserDetails(req,res){
    try {
        const userId = req.userId //auth middleware
        const { name, email, mobile, password } = req.body 

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return res.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
//forgot password
export const forgotPassword = async(req,res)=>{
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message : "User not found",
                error : true,
                success : false
            })
        }
        const otp=genratedOtp();
        
        
        const expiredTime=new Date(new Date()+60*60*1000); //1hr
        const updateUser = await UserModel.findByIdAndUpdate({_id:user._id},{
            forgot_password_otp:otp,
            forgot_password_expire:new Date(expiredTime).toISOString()
        })

        await sendEmail({
            sendTo:user.email,
            subject:"Forgot password from blinkYT",
            html:forgotPasswordTemplate({
                name:user.name,
                otp
            })
        })

        return res.status(200).json({
            message : "Check your email for OTP",
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
//verify forgot password otp

export async function verifyForgotPasswordOtp(req,res){

    try {
        const {email,otp}=req.body;
        if(!email||!otp){
            return res.status(400).json({
                message:"Please provide all the reuired feild email and otp",
                error:true,
                success:false
            })
        }


        const user = await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"User not found",
                error:true,
                success:false
            })
        }

        const currentTime=new Date().toISOString();
        const expiredTime=new Date(user.forgot_password_expire);
        if(currentTime>expiredTime){
            return res.status(400).json({
                message:"OTP expired",
                error:true,
                success:false
            })
        }

        const isOtpMatch=user.forgot_password_otp===otp;
        if(!isOtpMatch){
            return res.status(400).json({
                message:"Invalid OTP",
                error:true,
                success:false
            })
        }

         return res.json({
            message:"OTP Verification completed successfully",
            error:false,
            success:true
         })
        
    } catch (error) {
       return res.status(500).json({
        message:error.message||error,
        error:true,
        success:false})
        
    }
}
//reset the password
export const resetPassword=async(req,res)=>{
    try {
        const {email,newpassword,confirmpassword}=req.body;
        if (!email || !newpassword || !confirmpassword) {            
            return res.status(400).json({
                message:"Invalid request",
                error:true,
                success:false
            })
            
        }
        const user=await UserModel.findOne({email});
        if (!user) {
            return res.status(400).json({
                message:"Invalid request",
                error:true,
                success:false
            })
            
        }
        if (newpassword!==confirmpassword) {
            return res.status(400).json({
                message:"New password and confirm password does not match",
                error:true,
                success:false
            })
            
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(newpassword,salt);   
        const updateUser=await UserModel.findByIdAndUpdate(user._id,{
            password:hashPassword
        })
        return res.json({
            message:"Password reset successfully",
            error:false,
            success:true
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}
//refresh token controller
export async function refreshTokenController(req,res){

try {
    const refreshToken=req.cookies.refreshToken||req?.header?.authorization?.split(" ")[1];
    if(!refreshToken){
        return res.status(401).json({
            message:"Invalid refresh token1",
            error:true,
            success:false
        })
    }

    const verifyToken=jwt.verify(refreshToken,process.env.SECERET_KEY_REFRESH_TOKEN);
    if(!verifyToken){
        return res.status(401).json({
            message:"token expired",
            error:true,
            success:false
        })
    }
   
    const userId=verifyToken.id;
    const newAccessToken= await genrateAccessToken(userId);
    
    const cookiesOption={
        httpOnly:true,
        secure:true,
        "sameSite":"none"
    }
    res.cookie('accessToken',newAccessToken,cookiesOption)

    return res.json({
        message:"Refresh token success and new accesstoken genrated",
        error:false,
        success:true,
        data:{
            accessToken:newAccessToken
        }
    })
    
} catch (error) {
    return res.status(500).json({
        message:error.message||error,
        error:true,
        success:false
    })
}


}

