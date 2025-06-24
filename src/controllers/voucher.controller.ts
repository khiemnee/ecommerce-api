import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const { code, discount, expiresAt } = req.body;

    const voucher = await prisma.voucher.create({
      data: {
        code,
        discount,
        expiresAt: new Date(expiresAt),
      },
    });

    if (!voucher) {
      res.status(404).send({
        error: "Something wrong, please try again",
      });
      return;
    }
    res.status(200).send(voucher);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};

export const applyVoucher = async (req: Request, res: Response) => {
  const date = new Date();
  const {code} = req.body

  try {
    const voucher = await prisma.voucher.findFirst({
      where: {
        code
      },
    });

    if (!voucher) {
      res.status(404).send({
        error: "Voucher not exist",
      });
      return;
    }

    if (voucher.expiresAt < date) {
      res.status(500).send({
        error: "Voucher has expired",
      });
      return;
    }

    res.status(200).send(voucher);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
  }
};
