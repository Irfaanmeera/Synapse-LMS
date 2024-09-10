import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbUrl = process.env.MONGO

export const connectDb = async ()=>{
    
        await mongoose.connect(dbUrl!)
        .then(()=>{
            console.log('Database connected successfully')
        })
        .catch((err)=>{
        console.log("Database connection error"+ err.message)
         })
}