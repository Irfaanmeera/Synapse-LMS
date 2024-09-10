import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbUrl = process.env.PORT

const connectDb = async ()=>{
    try{
        await mongoose.connect(dbUrl!).the
    }
}