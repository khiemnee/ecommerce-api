import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import client from "../helpers/redis.helper";
import { stripeApiKey } from "../secret";
import { cartTotal } from "../helpers/cartTotal.helper";

const prisma = new PrismaClient();
const stripe = new Stripe(stripeApiKey!);

export const orderCheckOut = async (req: Request, res: Response) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItems || cartItems.length === 0) {
      res.status(500).send({
        error: "Nothing in cart to checkout, go shopping then comeback",
      });
      return;
    }

    const voucher = await prisma.voucher.findFirst({
      where: {
        code: req.body.voucher,
      },
    });

    let total = await cartTotal(cartItems);

    if (voucher) {
      total = total - (total * Number(voucher.discount)) / 100;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price,
        },
        quantity: item.quantity,
      })),

      discounts: [
        {
          coupon: voucher?.code,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        userId: req.user.id,
        total,
      },
    });

    res.status(200).send(session.url);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const userOrders = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      res.status(500).send({
        error: "orders is empty, shopping then comeback",
      });
      return;
    }
    await client.setEx(req.key.toString(), 300, JSON.stringify(order));
    res.status(200).send(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const order = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const order = await prisma.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) {
      res.status(404).send({
        error: "something went wrong, please try later",
      });
      return;
    }

    res.status(200).send(order);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const allOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany();

    if (!orders) {
      res.status(500).send({
        error: "Orders are empty",
      });
      return;
    }

    res.status(200).send(orders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
