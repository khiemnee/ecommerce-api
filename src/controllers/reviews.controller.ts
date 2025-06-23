import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      res.status(404).send({
        error: "product not found",
      });
      return;
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        ...req.body,
      },
    });

    res.status(200).send(review);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      res.status(404).send({
        error: "product not found",
      });
      return;
    }

    const reviews = await prisma.review.findMany({
        where : {
            productId : product.id
        }
    })

    res.status(200).send(reviews)
  } catch (error) {
    if(error instanceof Error){
        res.status(500).send(error.message)
    }
  }
};

