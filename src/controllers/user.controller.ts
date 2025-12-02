import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/users.services.js"
import { AppError } from "../utils/AppError.js";
import { Prisma } from "@prisma/client";


export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const file = req.file;
        const user = await userService.update(id, data, file);
        return res.status(200).json(user);
    } catch(error) {
        next(error);
    }
}


export const findById = async(req: Request, res: Response, next: NextFunction) => {

    try{

        const {id} = req.params
        const user = await userService.findById(Number(id))
        return res.status(201).json(user);
    }catch(error){
        next(error)
    }

}

