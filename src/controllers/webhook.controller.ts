import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { cartTotal } from "../helpers/cartTotal.helper";
import { stripeEndPoint, stripeKey } from "../secret";

const stripe = new Stripe(
  stripeKey!
);
const prisma = new PrismaClient();

export const webHookOrder = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = stripeEndPoint!

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  if (event!.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata!.userId;
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        total: await cartTotal(cartItems),
      },
    });

    const orderItems = await Promise.all(
      cartItems.map((values) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            price: values.product.price,
            quantity: values.quantity,
            productId: values.product.id,
          },
        })
      )
    );

    await Promise.all(
      cartItems.map((values) =>
        prisma.product.update({
          data: {
            stock: {
              decrement: values.quantity,
            },
            
          },
          where: {
            id: values.product.id,
          },
        })
      )
    );

    await prisma.order.update({
        data : {
            status :'PAID'
        },
        where : {
            id : order.id
        }
    })

    await prisma.cartItem.deleteMany({
      where: {
        userId
      },
    });
    res.status(200).send({order,orderItems})
  }
};
