import { generateToken } from "../config/jwt.js";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";

export const register = async (req: any, res: any) => {
  const { username, password, email } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const uniqueUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (uniqueUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: encryptedPassword,
      },
    });
    const token = generateToken({ id: user.id, username: user.username });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken({ id: user.id, username: user.username });
    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    });
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req: any, res: any) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
