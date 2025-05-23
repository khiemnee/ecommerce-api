import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Auth } from "../helpers/validator.helper";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefeshToken } from "../helpers/token.helper";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export const authRegister = async (req: Request, res: Response) => {
  const hashPassword = bcryptjs.hashSync(req.body.password, 8);

  try {
    const auth: Auth = await prisma.user.create({
      data: {
        ...req.body,
        password: hashPassword,
      },
    });

    res.status(201).send(auth);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    }
  }
};

export const authLogin = async (req: Request, res: Response) => {
  try {
    const auth = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!auth) {
      res.status(404).send({
        error: "User not found",
      });

       return;
    }

    const isMatch = bcryptjs.compareSync(req.body.password, auth.password);

    if (!isMatch) {
      res.status(404).send({
        error: "User not found",
      });

      return;
    }

    const accessToken = await generateAccessToken(auth.id)
    const refeshToken = await generateRefeshToken(auth.id)

    res.cookie('refeshToken',refeshToken,{
        httpOnly : true,
        secure : true,
        sameSite : true,
        maxAge : 604800000
    })

    res.status(200).send({auth,accessToken})


  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    }
  }
};

export const refeshToken = async (req:Request,res:Response) =>{
    try {
        
        const token = req.cookies.refeshToken

        if(!token){
            res.status(500).send({
                error : 'Token has expried'
            })
            return
        }

        const payload = jwt.verify(token,'ecommerceKeyRefesh') as {id:String}
        const accessToken = await generateAccessToken(payload.id)

        res.status(200).send({accessToken})

    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const logOut = async (req:Request,res:Response) =>{
    try {
        res.clearCookie('refeshToken',{
            httpOnly : true,
            secure : true,
            sameSite : true
        })
        res.status(200).send('logout sucsessfull')
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const getMe = async (req:Request,res:Response) =>{
    try {
        res.status(200).send(req.user)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const getListUsers = async (req:Request,res:Response) =>{
    try {
        const users = await prisma.user.findMany({})

        if(!users){
            res.status(404).send({
                error : 'users not found'
            })
        }

        res.status(200).send(users)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const getUser = async(req:Request,res:Response) =>{

    const id = req.params.id

    try {
        const auth = await prisma.user.findFirst({
            where : {
                id 
            }
        })

        if(!auth){
            res.status(404).send({
                error : 'user not found'
            })
        }

        res.status(200).send(auth)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const deleteUser = async(req:Request,res:Response) =>{

    const id = req.params.id

    try {
        const auth = await prisma.user.delete({
            where : {
                id 
            }
        })

        if(!auth){
            res.status(404).send({
                error : 'user not found'
            })
        }

        res.status(200).send(auth)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}