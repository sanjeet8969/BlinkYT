import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import sendEmail from "../config/sendEmail.js";
import genrateAccessToken from "../utils/genrateAccessToken.js";
import genrateRefereshToken from "../utils/genrateRefereshToken.js";
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