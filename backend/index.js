import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/authRoutes.js";
import otherRouter from "./routes/otherRoutes.js";

dotenv.config({});
const app = express();

const PORT = 8001;

// default middleware
app.use(express.json());  // ✅ Ensure JSON body parsing is enabled
app.use(express.urlencoded({ extended: true })); // ✅ For URL-encoded data
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));


app.use("/user" , userRouter);
app.use("/api" , otherRouter);


app.get('/' , (req , res) => {
    return res.json({msg: "hello , i am BTS"});
})

app.listen(PORT , ()=> {
    console.log(`Server is listening at PORT ${PORT}`);
})