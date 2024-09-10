import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbUrl = process.env.PORT

const connectDb = async ()=>{
    try{
        await mongoose.connect(dbUrl!).then(()=>{
            console.log('Databse')
        })
    }catch(err){
        console.log(err)
    }
}