import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Productoption } from "../models/productOption.model.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, { isValidObjectId } from "mongoose"


const addProductOption = asyncHandler(async (req, res) => {

    const { ProductName, Options } = req.body

    if (
        (!ProductName && !Options)
    ) {
        throw new ApiError(400, "All field are required")
    }


    const productoptionimgLocalPath = req.files?.optionimg[0]?.path;

    if (!productoptionimgLocalPath) {
        throw new ApiError(400, "image file is required")
    }

    const optionImg = await uploadOnCloudinary(productoptionimgLocalPath)

    if (!optionImg) {
        throw new ApiError(400, "product image file is required")
    }

    const productOption = await Productoption.create({
        ProductName,
        Options,
        optionimg: {
            url: optionImg.url,
            public_id: optionImg.public_id
        }
    })

    return res.status(201).json(
        new ApiResponse(200, productOption, "Product added Successfully")
    )

})

const getProductOption = asyncHandler(async (req, res) => {
    const productOption = await Productoption.find()

    if (!productOption) {
        throw new ApiError(400, "product Options are not found")
    }

    else if (productOption.length > 0) {
        res.status(201).json(
            new ApiResponse(200, productOption, "product Options fetched successfully")
        )
    }

    else {
        res.status(201).json(
            new ApiResponse(200, "currantly have not any product Options")
        )
    }
})

const updateProductOptionDetails = asyncHandler(async (req, res) => {

    const { productOptionId } = req.params
    const { ProductName, Options } = req.body;

    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid productOptionId");
    }

    if (!(Options && ProductName)) {
        throw new ApiError(400, "ProductName and options are required");
    }

    const productOption = await Productoption.findById(productOptionId);

    if (!productOption) {
        throw new ApiError(404, "No product Option found");
    }

    // deleting old img and updating with new one
    const optionImgToDelete = productOption.optionimg.public_id
    const productOptionImgLocalPath = req.file?.path;

    if (!productOptionImgLocalPath) {
        throw new ApiError(400, "product image is required");
    }

    const optionImg  = await uploadOnCloudinary(productOptionImgLocalPath);

    if (!optionImg ) {
        throw new ApiError(400, "product image not found");
    }


    const updateProductOption = await Productoption.findByIdAndUpdate(
        productOptionId,
        {
            $set: {
                ProductName,
                Options,
                optionimg: {
                    public_id: optionImg.public_id,
                    url: optionImg.url
                }
            }
        },
        { new: true }
    );

    if (!updateProductOption) {
        throw new ApiError(500, "Failed to update Product Option please try again");
    }

    if (updateProductOption) {
        await deleteOnCloudinary(optionImgToDelete);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProductOption, "Product updated successfully"));
})

const deleteProductOption = asyncHandler(async (req, res) => {

    const { productOptionId } = req.params

    if (!isValidObjectId(productOptionId)) {
        throw new ApiError(400, "Invalid productId");
    }

    const productOption = await Productoption.findById(productOptionId);


    if (!productOption) {
        throw new ApiError(404, "No product found");
    }


    const deleteProduct = await Productoption.findByIdAndDelete(productOptionId);

    if (!deleteProduct) {
        throw new ApiError(500, "Failed to delete product please try again");
    }

    await deleteOnCloudinary(productOption.optionimg.public_id);

    return res
        .status(200)
        .json(new ApiResponse(200, deleteProduct, "Product deleted successfully"));
})



export {
    addProductOption,
    getProductOption,
    updateProductOptionDetails,
    deleteProductOption
}