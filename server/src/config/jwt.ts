import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_ACCESS_SECRET as string,
  expiresIn: "10d",
};

export const generateToken = (payload: any) => {
  //@ts-ignore
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

export const verifyToken = (token: any) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    throw new Error("Invalid token");
  }
};
