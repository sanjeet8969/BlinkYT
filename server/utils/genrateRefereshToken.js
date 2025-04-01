import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const genrateRefereshToken=(userId)=>{
    const token=jwt.sign({id:userId},
        process.env.SECERET_KEY_REFRESH_TOKEN,
        {expiresIn:"5h"}
    );
    return token;
}

export default genrateRefereshToken;