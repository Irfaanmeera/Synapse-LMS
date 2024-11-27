import {httpServer} from './app'
import dotenv from 'dotenv'
import { connectDb } from './src/config/db'
dotenv.config()
connectDb()
httpServer.listen(process.env.PORT, ()=>{
    console.log(`Server is connected with port ${process.env.PORT}`)

  });