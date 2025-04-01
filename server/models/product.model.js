import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    image:{
        type:Array,
        default:[]
        
    } ,
    categoryId:[{
        type:mongoose.Schema.ObjectId,
        ref:"Category"
    }], 
    subCategoryId:[{
        type:mongoose.Schema.ObjectId,
        ref:"SubCategory"
    }],
    unit:{
        type:String,
        default:""
    },
    stock:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:null
    },
    discount:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:""
    },
    more_details:{
        type:mongoose.Schema.ObjectId,
        default:{}
    },
    publish:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const ProductModel =mongoose.model("Product",productSchema);
export default ProductModel;