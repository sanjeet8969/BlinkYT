import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    orderId:{
        type:String,
        reuqired:[true,"Provide Order Id"],
        unique:true
    },
    product_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Product"
    },
    
    products_details:[{
       name:String,
       image:Array
    }],
    payment_id:{
        type:String,
        default:""
    },
    payment_status:{
        type:String,
        default:""
    },
    delivery_address:{
        type:mongoose.Schema.ObjectId,
        ref:"Address"
    },
    sub_total_amount:{
        type:Number,
        default:0
    },
    total_amount:{
        type:Number,
        default:0
    },
    invoice_receipt:{
        type:String,
        default:""
    }
    
},{
    timestamps:true
});

const OrderModel =mongoose.model("Order",orderSchema);    
export default OrderModel;