import { Router } from "express";
import {addProduct} from "../controllers/product.controller.js";
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

export default router