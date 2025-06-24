import client from "../../helpers/redis.helper";
import { Request, Response, NextFunction } from "express";

export const productsCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cache = await client.get("products");

  if (cache) {
    console.log('here')
    res.status(200).send(JSON.parse(cache));
    return;
  }
  req.key = "products";
  next();
};

export const categoriesCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cache = await client.get("categories:all");

  if (cache) {
    res.status(200).send(JSON.parse(cache));
    return;
  }
  req.key = "categories:all";
  next();
};

export const productDetailCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cache = await client.get(`product:${req.user.id}`);

  if (cache) {
    res.status(200).send(JSON.parse(cache));
    return;
  }
  req.key = `product:${req.user.id}`;
  next();
};

export const cartCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cache = await client.get(`cart:${req.user.id}`);

  if (cache) {
    res.status(200).send(JSON.parse(cache));
    return;
  }
  req.key = `cart:${req.user.id}`;
  next();
};

export const userOrdersCache = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cache = await client.get(`orders:${req.user.id}`);

  if (cache) {
    res.status(200).send(JSON.parse(cache));
    return;
  }
  req.key = `orders:${req.user.id}`;
  next();
};
