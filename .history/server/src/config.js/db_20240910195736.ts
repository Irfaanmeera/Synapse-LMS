import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv

const dbUrl = process.env.PORT

export const connectDb = async ()=>{
    
        await mongoose.connect(dbUrl!)
        .then(()=>{
            console.log('Database connected successfully')
        })
        .catch((err)=>{
        console.log("Database connection error"+ err.message)
         })
}