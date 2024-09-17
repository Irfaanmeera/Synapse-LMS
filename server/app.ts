/* eslint-disable @typescript-eslint/no-explicit-any */
import express, {Request,Response,NextFunction} from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorMiddleware } from './src/middlewares/error'
import morgan from 'morgan';

app.use(express.json({limit:'50mb'}))
app.use(cookieParser())
app.use(cors({
    origin:process.env.ORIGIN
}))
app.use(morgan('dev'))


//testing api

app.get('/test',(req:Request,res:Response)=>{
    res.status(200).json({
        sucess:true,
        message:'API is working'
    })
})

//unknown route
app.all('*',(req:Request,res:Response,next:NextFunction)=>{
const err= new Error(`Route ${req.originalUrl} not found`) as any;
err.statusCode= 404;
next(err)
})
app.use(ErrorMiddleware)

