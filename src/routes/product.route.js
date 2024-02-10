import { Router } from "express";
import {addProduct, deleteProduct, getProduct, updateProductDetails} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/addproduct").post(
    upload.fields([
        {
            name: "img",
            maxCount: 1
        }
    ]),
    addProduct
    )

router.route("/getproduct").get(getProduct)
router.route("/updateproduct/:productId").put(upload.single("img"),updateProductDetails)
router.route("/deleteproduct/:productId").delete(deleteProduct)


export default router