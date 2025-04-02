import { Router } from "express";
import {registerUserController} from "../controllers/user.controller.js";
import {verifyEmailController} from "../controllers/user.controller.js";
import {loginUserController} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import {logoutUserController} from "../controllers/user.controller.js";
import {uploadUserAvatarController} from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
import { updateUserDetails } from "../controllers/user.controller.js";
import {forgotPassword} from "../controllers/user.controller.js";
import {verifyForgotPasswordOtp} from "../controllers/user.controller.js";
import {resetPassword} from "../controllers/user.controller.js";
import {refreshTokenController} from "../controllers/user.controller.js";
const userRouter = Router();

userRouter.post("/register",registerUserController);
userRouter.post("/verify-email",verifyEmailController);
userRouter.post("/login",loginUserController);
userRouter.get("/logout",auth,logoutUserController);
userRouter.put("/upload-avatar",auth,upload.single("avatar"),uploadUserAvatarController);
userRouter.put("/update-user",auth,updateUserDetails)
userRouter.put("/forgot-password",forgotPassword);
userRouter.put("/verify-forgot-password-otp",verifyForgotPasswordOtp);
userRouter.put("/reset-password",resetPassword);
userRouter.post("/refresh-token",refreshTokenController);
export default userRouter;