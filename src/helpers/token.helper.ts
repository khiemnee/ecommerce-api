import jwt from "jsonwebtoken";
import { accessTokenKey, refeshTokenKey } from "../secret";

export const generateAccessToken = async (id: String) => {
  const token = jwt.sign({ id }, accessTokenKey!, { expiresIn: "15m" });
  return token;
};

export const generateRefeshToken = async (id: String) => {
  const token = jwt.sign({ id }, refeshTokenKey!, { expiresIn: "7d" });
  return token;
};
