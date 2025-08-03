import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();

const mongo_url = process.env.MONGODB_URL

export const connectDB = async () => {
     mongoose.connect(mongo_url)
    .then(()=>{
        console.log("mongoose connect sucessfully")
    })
    .catch((err)=>{
        console.log(err)
    })
}

export default connectDB;
