import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:1
    },
   userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

const CartProductModel =mongoose.model("CartProduct",cartProductSchema);    
export default CartProductModel;