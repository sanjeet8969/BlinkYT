    import mongoose from "mongoose";
    
    const addressSchema = new mongoose.Schema({
        address:{
            type:String,
            default:""
        },
        city:{
            type:String,
           default:""
        },
        state:{
            type:String,
            default:""
        },
        pincode:{
            type:Number,
           default:""
        },
        country:{
            type:String,
           default:""
        },
       mobile:{
            type:Number,
            default:null
        },
        status:{
            type:Boolean,
            default:true
        }
    },{
        timestamps:true
    });
    
    const AddressModel =mongoose.model("Address",addressSchema);
    export default AddressModel;