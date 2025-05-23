import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { Request,Response } from "express";

const prisma = new PrismaClient()

export const createCategory = async (req:Request,res:Response) =>{
    try {
        const cate = await prisma.category.create({
            data : {
                ...req.body
            }
        })
        if(!cate){
            res.status(404).send({
                error : 'something wrong, try again'
            })

            return
        }
        res.status(200).send(cate)
    } catch (error) {
        if(error instanceof Error){
            res.status(404).send(error.message)
        }
    }
}

export const getCategory = async (req:Request,res:Response) =>{
    try {
        const categories = await prisma.category.findMany()

        if(!categories){
            res.status(404).send({
                error : 'categories not found'
            })
            return
        }

        res.status(200).send(categories)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const updateCategory = async(req:Request,res:Response) =>{

    const id = req.params.id

    try {   
            const categories = await prisma.category.findFirst({
                where : {
                    id
                }
            })

            if(!categories){
                res.status(404).send({
                    error : 'categories not found'
                })
                return
            }

            const updates = Object.keys(req.body)
            const allowedUpdates = ['name']


            const isMatched = updates.every((values) => allowedUpdates.includes(values))

            if(!isMatched){
                res.status(404).send({
                    error : 'invalid field to update'
                })
                return
            }

            const cate = await prisma.category.update({
                where : {
                    id : categories.id
                },
                data : {
                    ...req.body
                }
            })

            res.status(200).send(cate)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}

export const deleteCategory = async(req:Request,res:Response) =>{

    const id = req.params.id

    try {
        const categories = await prisma.category.findFirst({
            where : {
                id
            }
        })

        if(!categories){
            res.status(404).send({
                error : 'categories not found!'
            })
        }

        const cate = await prisma.category.delete({
            where : {
                id : categories?.id
            }
        })

        res.status(200).send(cate)

    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}