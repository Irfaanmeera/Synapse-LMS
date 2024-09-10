import mongoose from 'mongoose'
import dotenv from 'dotenv'

const dbUrl = process.env.PORT

expoconst connectDb = async ()=>{
    try{
        await mongoose.connect(dbUrl!).then(()=>{
            console.log('Database connected successfully')
        })
    }catch(err){
        console.log(err)
    }
}