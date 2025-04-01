import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
if(!process.env.MONGODB_URI)
{
    throw new Error("Please set MONGODB_URI ");
}

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDb connected");

    }catch(error){
        console.log("MnogoDb connection error",error);
        process.exit(1);
    }
}

export default connectDB;
