import mongoose from "mongoose";
const connectDB=async()=>{
    return await mongoose.connect(process.env.DB_LOCAL)
    .then(()=>{
        console.log("db connection established");
    })
    .catch((error)=>{
        console.log(`Error to connect: ${error}`);
    });
}
export default connectDB;