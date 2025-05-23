import { NextFunction, Request,Response } from "express"
import { Role } from "@prisma/client"



export const checkRole = async(req:Request,res:Response,next:NextFunction) =>{
    try {
        const role = req.user.role

        if(role !== Role.ADMIN){
            res.status(403).send({
                error : 'Not authorized'
            })
        }

        next()
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}