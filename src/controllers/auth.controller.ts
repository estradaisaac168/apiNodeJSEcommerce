import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js"
import { AppError } from "../utils/AppError.js";
import { Prisma } from "@prisma/client";

export const login = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await authService.loginUser(req.body);
        return res.status(200).json(result);
    }catch(error){
        next(error)
    }

    //200 exito,
    //201 exito cuando creacion de informacion

}


export const register = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const result = await authService.register(req.body);
        return res.status(200).json(result);
    }catch(error){
        next(error)
    }

    //200 exito,
    //201 exito cuando creacion de informacion

}
