import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (
    error: any,
    request: Request,
    reponse: Response,
    next: NextFunction
) => {
    if(error instanceof AppError){
        return reponse.status(error.statusCode).json({
            message: error.message,
            statusCode: error.statusCode,
        });
    }

    console.error(error);

     return reponse.status(error.statusCode).json({
        message: "Error interno del servidor",
        statusCode: 500,
    });
}