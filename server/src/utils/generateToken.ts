/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');
dotenv.config();

export class CreateJWT {
    // Generate Access Token
    generateAccessToken(payload: string | undefined): string | undefined {
        if (payload) {
            const token = jwt.sign(
                { data: payload }, 
                process.env.JWT_SECRET as Secret, 
                { expiresIn: '5m' } 
            );
            return token;
        }
    }

    // Generate Refresh Token
    generateRefreshToken(payload: string | undefined): string | undefined {
        return jwt.sign(
            { data: payload }, 
            process.env.JWT_REFRESH_SECRET as Secret, 
            { expiresIn: '48h' }
        );
    }

    // Verify Access Token
    verifyAccessToken(token: string): JwtPayload | null {
        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret) as JwtPayload;
            return { success: true, decoded };
        } catch (err: any) {
            console.error('Error while verifying JWT token:', err);
            if (err?.name === 'TokenExpiredError') 
                return { success: false, message: 'Token Expired!' };
            else 
                return { success: false, message: 'Internal server error' };
        }
    }

    // Verify Refresh Token
    verifyRefreshToken(token: string) {
        try {
            const secret = process.env.JWT_REFRESH_SECRET;
            const decoded = jwt.verify(token, secret) as JwtPayload;
            return { success: true, decoded };
        } catch (error) {
            console.log(error as Error);
        }
    }
}
