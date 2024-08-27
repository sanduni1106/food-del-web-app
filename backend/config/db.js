import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sanduni:768878812@cluster0.mdvs7vl.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}