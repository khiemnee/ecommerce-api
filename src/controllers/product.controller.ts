import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import client from "../helpers/redis.helper";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      order = "createdAt",
      page = 1,
      limit = 10,
      sortBy = "desc",
    } = req.params;
    const skip = (Number(page) - 1) * 10;
    const orderBy = {
      [String(order)]: sortBy,
    };

    const products = await prisma.product.findMany({
      skip,
      take: Number(limit),
      orderBy,
    });

    if (!products) {
      res.status(404).send({
        error: "products not found",
      });
      return;
    }

    await client.setEx(req.key.toString(), 3600, JSON.stringify(products));
    res.status(200).send(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const getProduct = async (req: Request, res: Response) => {
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

    const productAvgRating = await prisma.review.aggregate({
      where: {
        productId: product.id,
      },
      _avg: {
        rating: true,
      },
    });

    const { _avg } = productAvgRating;
   
    res.status(200).send({ product, _avg });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const imageUrl = req.file?.path;
  const { price, stock, ...rest } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        imageUrl,
        price: parseFloat(price),
        stock: parseInt(stock),
        ...rest,
      },
    });

    if (!product) {
      res.status(404).send({
        error: "somthing wrong, try again",
      });
      return;
    }

    res.status(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const imageUrl = req.file?.path;

    const temptProduct = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!temptProduct) {
      res.status(404).send({
        error: "product not found",
      });
      return;
    }

    if (req.body === undefined && imageUrl === undefined) {
      res.status(404).send({
        error: "Please enter at least 1 field to update",
      });
      return;
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "description",
      "price",
      "stock",
      "categoryId",
    ];

    const isMatched = updates.every((values) =>
      allowedUpdates.includes(values)
    );

    if (!isMatched) {
      res.status(404).send({
        error: "invalid field update",
      });
      return;
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        imageUrl: imageUrl ? imageUrl : temptProduct.imageUrl,
        ...req.body,
      },
    });

    res.status(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!product) {
      res.status(500).send({
        error: "product not found",
      });
    }

    res.status(200).send(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
