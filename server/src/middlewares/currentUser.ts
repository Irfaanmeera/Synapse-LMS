/* eslint-disable @typescript-eslint/no-unused-vars */
import {Request,Response,NextFunction} from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'

import { ForbiddenError } from '../constants/errors/forbiddenError'

declare module 'express'{
  interface Request {
    currentUser?: string
  }
}

export const isAdminAuth = (res:Response,req:Request,next:NextFunction)=>{
    try{
     const authorizationHeader = req.headers.authorization;
     if(authorizationHeader){
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;
        if(decoded.role==='admin'){
          req.currentUser = decoded.adminId;
          next()
        }else{
          throw new ForbiddenError('Invalid Token')
        }
     }else{
      throw new ForbiddenError('Invalid Token')
    }

    }catch(error){
        throw new ForbiddenError("Invalid token");
        res.send({});
    }
  }

    export const isStudentAuth = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const authorizationHeader = req.headers.authorization;
        console.log(authorizationHeader)
        if (authorizationHeader) {
          const token = authorizationHeader.split(" ")[1];
          console.log(token)
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
          if (decoded.role === "student") {
            req.currentUser = decoded.studentId;
            next();
          } else {
            throw new ForbiddenError("Invalid token");
          }
        } else {
          throw new ForbiddenError("Invalid token");
        }
      } catch (error) {
        throw new ForbiddenError("Invalid token");
        res.send({});
      }
    }

      export const isInstructorAuth = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const authorizationHeader = req.headers.authorization;
          const refreshTokenHeader = req.headers["x-refresh-token"];
      
          if (!authorizationHeader) {
            throw new ForbiddenError("Access token is missing");
          }
      
          const token = authorizationHeader.split(" ")[1];
          console.log(token)
          let decoded: JwtPayload;
      
          try {
            // Verify the access token
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
            // Check if the token belongs to an instructor
            if (decoded.role === "instructor") {
              req.currentUser = decoded.instructorId;
              console.log(req.currentUser)
              return next();
            } else {
              throw new ForbiddenError("Invalid token");
            }
          } catch (error) {
            // Access token might be expired, so we handle the refresh token
            if (error.name === "TokenExpiredError" && refreshTokenHeader) {
              const refreshToken = refreshTokenHeader as string;
      
              try {
                // Verify the refresh token
                const refreshDecoded = jwt.verify(
                  refreshToken,
                  process.env.JWT_REFRESH_KEY!
                ) as JwtPayload;
      
                // Ensure the refresh token belongs to an instructor
                if (refreshDecoded.role === "instructor") {
                  req.currentUser = refreshDecoded.instructorId;
      
                  // Generate a new access token
                  const newAccessToken = jwt.sign(
                    { instructorId: refreshDecoded.instructorId, role: "instructor" },
                    process.env.JWT_KEY!,
                    { expiresIn: "15m" } // Short expiry time for access token
                  );

                  console.log('new acces token: '+ newAccessToken)
      
                  // Include the new access token in the response headers
                  res.setHeader("x-access-token", newAccessToken);
      
                  return next();
                } else {
                  throw new ForbiddenError("Invalid refresh token");
                }
              } catch (refreshError) {
                throw new ForbiddenError("Invalid refresh token");
              }
            } else {
              throw new ForbiddenError("Invalid access token");
            }
          }
        } catch (error) {
          res.status(403).json({ success: false, message: "Unauthorized access" });
        }
      };
    