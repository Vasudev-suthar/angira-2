import { Schema } from "mongoose";
import mongoose from "mongoose";

const productOptionSchema = new Schema({
    ProductName: {
        type: String,
        required: true
    },
    Options: [
        {
            name: String,
            value: [String],
        }
    ],
    optionimg:{
        type: {
            url: String,
            public_id: String,
        },
        required:true
    }
})

export const Productoption = mongoose.model("Productoption", productOptionSchema)