import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../config/jwt.js";

export interface AuthRequest extends Request{
    user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("Token no proporcionado por el usuario", 401);
    }

    const token = authHeader.split(" ")[1];


    try{
        const decoded = verifyToken(token!);
        req.user = decoded;
        next();
    }catch(error){
        throw new AppError("Token no valido o expirado", 401);
    }
}