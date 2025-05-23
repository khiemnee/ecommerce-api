import jwt from "jsonwebtoken";

export const generateAccessToken = async (id: String) => {
  const token = jwt.sign({ id }, "ecommerceKeyAccess", { expiresIn: "15m" });
  return token;
};

export const generateRefeshToken = async (id: String) => {
  const token = jwt.sign({ id }, "ecommerceKeyRefesh", { expiresIn: "7d" });
  return token;
};
