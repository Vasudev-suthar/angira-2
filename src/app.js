import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import productRouter from "./routes/product.route.js"
import productOptionRouter from "./routes/productOption.route.js"

//routes declaration
app.use("/api/v1", productRouter)
app.use("/api/v2", productOptionRouter)


export {app}