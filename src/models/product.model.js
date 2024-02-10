import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema ({
    CategoryName: {
        type : String,
        required : true
    },
    ProductName: {
        type : String,
        required : true
    },
    img:{
        type: String,  // cloudinary url
        required:true
    },
    description: {
        type : String,
        required : true
    }
})

export const Product = mongoose.model("Product", productSchema)