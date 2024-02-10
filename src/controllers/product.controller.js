import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"


const addProduct = asyncHandler(async (req, res) => {

    const {CategoryName, ProductName, description} = req.body
    // console.log("email: ", email)

    if (
        [CategoryName, ProductName, description].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }


    const productImgLocalPath = req.files?.img[0]?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const productImg = await uploadOnCloudinary(productImgLocalPath)

    if (!productImg) {
        throw new ApiError(400, "product image file is required")
    }

    const product = await Product.create({
        CategoryName,
        ProductName,
        img: productImg.url,
        description

    })

    return res.status(201).json(
        new ApiResponse(200, product, "Product added Successfully")
    )

})



export{addProduct}