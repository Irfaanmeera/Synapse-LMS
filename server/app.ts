/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, NextFunction } from 'express'
export const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ErrorMiddleware } from './src/middlewares/error'
import morgan from 'morgan';
import dotenv from 'dotenv';
import studentRouter from "./src/routes/studentRoutes";
import instructorRouter from './src/routes/instructorRoutes';
import adminRouter from './src/routes/adminRoutes'
import { io } from "./src/services/SocketIOServices";
import http from 'http'
import authRouter from './src/routes/authRoutes'
import fs from 'fs';
import path from 'path';
import logger from './logger'


dotenv.config();


app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"], // Allowed methods
    credentials: true ,// If you need to send cookies or authorization headers
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
}));
app.options('*', cors()); // This will allow preflight requests for all routes

app.use(morgan('dev'))


app.use('/', studentRouter);
app.use("/instructor", instructorRouter);
app.use("/admin",adminRouter)
app.use('/auth', authRouter);
// Example of a refresh-token route in Express (backend)

app.use((err: any, req: any, res: any, next: any) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(500).send('Internal Server Error');
  });
const httpServer = http.createServer(app);
io.attach(httpServer);

//testing api

app.get('/test', (req: Request, res: Response) => {
    res.status(200).json({
        sucess: true,
        message: 'API is working'
    })
})

//unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err)
})
app.use(ErrorMiddleware)

export { httpServer };


