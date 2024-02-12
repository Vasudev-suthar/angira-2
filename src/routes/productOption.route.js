import { Router } from "express";
import { addProductOption, getProductOption, updateProductOptionDetails, deleteProductOption } from "../controllers/productOption.controller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/addproductoption").post(
    upload.fields([
        {
            name: "optionimg",
            maxCount: 1
        }
    ]),
    addProductOption
    )

router.route("/getproductoption").get(getProductOption)
router.route("/updateproductoption/:productOptionId").put(upload.single("optionimg"),updateProductOptionDetails)
router.route("/deleteproductoption/:productOptionId").delete(deleteProductOption)


export default router