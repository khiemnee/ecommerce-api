import { NextFunction, Request,Response } from "express";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const auth = async (req:Request,res:Response,next:NextFunction) =>{
    try {
        const token = req.headers.authorization?.replace('Bearer ','')
        const decode = jwt.verify(token!,'ecommerceKeyAccess') as {id : String}
        const user = await prisma.user.findFirst({
            where : {
                id : decode.id.toString()
            }
        })

        if(!user){
            res.status(404).send({
                error : 'user not found'
            })
        }

        req.user = user!
        next()
    } catch (error) {
        if(error instanceof Error){
            res.status(403).send('Token has expired')
        }
    }
}