import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }

    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: {
        username,
      },
    });

    if (!admin) {
      return res.status(401).json({
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({
        message: "اسم المستخدم أو كلمة المرور غير صحيحة",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
