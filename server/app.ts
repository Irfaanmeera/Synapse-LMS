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
import { generateToken } from './src/utils/generateJWT'
import jwt, { JwtPayload } from 'jsonwebtoken';
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

app.post('/refresh-token', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
      // Verify the refresh token (you may use JWT or any other approach)
      if (typeof decoded === 'object' && decoded.userId && decoded.role) {
        // Generate a new access token
        const newAccessToken = generateToken(
          decoded.userId,
          decoded.role,
          process.env.JWT_SECRET!,
          '1m' // Set a suitable expiry time
        );
  
        return res.json({ accessToken: newAccessToken });
      } else {
        return res.status(400).json({ message: 'Invalid token payload' });
      }
  
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
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


