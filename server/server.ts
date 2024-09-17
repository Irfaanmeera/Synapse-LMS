import {app} from './app'
import dotenv from 'dotenv'
import { connectDb } from './config/db'
dotenv.config()

app.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.PORT}`)
    connectDb()
})