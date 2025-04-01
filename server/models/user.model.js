
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Provide Name"],
    },
    email:{
        type:String,
        required:[,"Provide Email"],
        unique:true
    },
    password:{
        type:String,
        required:[ true,"Provide Password"],
    },
    avatar:{
        type:String,
        default:""
    },
    mobile:{
        type:String,
        default:null
    },
    refrteshToken:{
        type:String,
        default:""
    },
    verifyEmail:{
        type:Boolean,
        default:false
    },
    last_login:{
        type:Date,
        default:""
    },
    stauts:{
        type:String,
        enum:["active","inactive","Suspended"],
        default:"active"
    },
    address_details:{
        type:mongoose.Schema.ObjectId,
        ref:"Address"
    },
    shopping_cart:{
        type:mongoose.Schema.ObjectId,
        ref:"CartProduct"
    },
    order_history:{
        type:mongoose.Schema.ObjectId,
        ref:"OrderHistory"
    },
    forgot_password_otp:{
        type:String,
        default:null
    },
    forgot_password_expire:{
        type:Date,
        default:""
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    }
},{
    timestamps:true
});

const UserModel =mongoose.model("User",userSchema);
export default UserModel;