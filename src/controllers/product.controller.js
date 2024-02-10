import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, {isValidObjectId} from "mongoose"


const addProduct = asyncHandler(async (req, res) => {

    const { CategoryName, ProductName, description } = req.body
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

const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find()

    if (!products) {
        throw new ApiError(400, "products are not found")
    }

    else if (products.length > 0) {
        res.status(201).json(
            new ApiResponse(200, products, "products fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any products")
        )
    }
})

const updateProductDetails = asyncHandler(async (req, res) => {

    const { productId } = req.params
    const { CategoryName, ProductName, description } = req.body;

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    if (!(CategoryName && ProductName && description)) {
        throw new ApiError(400, "CategoryName, ProductName and description are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }
    

    const productImgLocalPath = req.file?.path;

    if (!productImgLocalPath) {
        throw new ApiError(400, "product image is required");
    }

    const img = await uploadOnCloudinary(productImgLocalPath);

    if (!img) {
        throw new ApiError(400, "product image not found");
    }


    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                CategoryName,
                ProductName,
                description,
                img: img.url
            }
        },
        { new: true }
    );

    if (!updateProduct) {
        throw new ApiError(500, "Failed to update product please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Product updated successfully"));
})

const deleteProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "No product found");
    }
    

    const deleteProduct = await Product.findByIdAndDelete(productId);

    if (!deleteProduct) {
        throw new ApiError(500, "Failed to delete product please try again");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));
})



export {
    addProduct,
    getProduct,
    updateProductDetails,
    deleteProduct
}