import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import client from "../helpers/redis.helper";

const prisma = new PrismaClient();

export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!cart) {
      res.status(404).send({
        error: "cart is empty",
      });
      return;
    }
    await client.setEx(req.key.toString(),30,JSON.stringify(cart))
    res.status(200).send(cart);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
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

    const exitsItem = await prisma.cartItem.findFirst({
      where: {
        productId: id,
        userId : req.user.id
      },
    });

    if (exitsItem) {
      const updatesItem = await prisma.cartItem.update({
        data: {
          quantity: exitsItem.quantity + req.body.quantity,
        },
        where: {
          id: exitsItem.id,
        },
      });
      res.status(200).send(updatesItem);
      return;
    }

    const item = await prisma.cartItem.create({
      data: {
        productId: product.id,
        userId: req.user.id,
        ...req.body,
      },
    });
    res.status(200).send(item);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        productId: id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      res.status(500).send({
        error: "cart item not found",
      });
      return;
    }

    const updatesItem = await prisma.cartItem.update({
      data: {
        quantity: req.body.quantity,
      },
      where: {
        id: cartItem.id,
      },
    });
    res.status(200).send(updatesItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        productId: id,
        userId: req.user.id,
      },
    });

    if (!cartItem) {
      res.status(500).send({
        error: "cart item not found",
      });
      return;
    }

    const deletedItem = await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    res.status(200).send(deletedItem);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const deleteCart = async (req:Request,res:Response) =>{
    try {
        const deletedCart = await prisma.cartItem.deleteMany({
            where : {
                userId : req.user.id
            }
        })

        res.status(200).send(deletedCart)
    } catch (error) {
        if(error instanceof Error){
            res.status(500).send(error.message)
        }
    }
}
