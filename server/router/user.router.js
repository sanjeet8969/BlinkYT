import { Router } from "express";
import {registerUserController} from "../controllers/user.controller.js";
import {verifyEmailController} from "../controllers/user.controller.js";
import {loginUserController} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import {logoutUserController} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.post("/register",registerUserController);
userRouter.post("/verify-email",verifyEmailController);
userRouter.post("/login",loginUserController);
userRouter.get("/logout",auth,logoutUserController);
export default userRouter;