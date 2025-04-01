import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import userRouter from "./router/user.router.js";
dotenv.config();

const app = express();
app.use(cors({
    credentials: true,
    origin:process.env.FRONTEND_URL
}));

app.use(cookieParser());
app.use(express.json());
app.use(morgan());
app.use(helmet(
    {
        contentSecurityPolicy: false
    }
));

app.get("/",(req,res)=>
{
    res.send("Hello World");
})

app.use("/api/v1",userRouter);

const PORT = 8080||process.env.PORT;
connectDB().then(()=>
{app.listen(PORT,()=>
{
    console.log("server is running on",PORT);
})})
