import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth=async(req,res,next)=>{

    try {

        const token=req.cookies.accessToken||req?.headers?.authorization.split(" ")[1];// ["bearer", "token"]
        if(!token)
        {
            return res.status(401).json({
                message:"Please login",
                error:true,
                success:false
            })
        }
        const decodedToken=await jwt.verify(token,process.env.SECERET_KEY_ACCESS_TOKEN);
       
        if(!decodedToken){
            return res.status(401).json({
                message:"Invalid token",
                error:true,
                success:false
            })
        }
      req.userId=decodedToken.id;
      next();
        
    } catch (error) {
        res.status(500).json({
            message: error.message||error,
            error:true,
            success:false
        })
    }
} 

export default auth;