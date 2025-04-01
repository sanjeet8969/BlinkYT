import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";
dotenv.config();

const genrateAccessToken=async(userId)=>{
    const token=jwt.sign({id:userId},
        process.env.SECERET_KEY_ACCESS_TOKEN,
        {expiresIn:"30d"}
    );

    const updateRefreshToken = await UserModel.updateOne(
        {_id:userId},{
            refrteshToken:token
        }
    );

    return token;
}

export default genrateAccessToken;


