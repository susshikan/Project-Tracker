import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '../../generated/prisma'


const prisma = new PrismaClient();

interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

interface LoginDTO {
  email: string;
  password: string;
}


export async function register({email, password, name}: RegisterDTO) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email sudah terdaftar");

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, password: hashed, name, totalProject: 0 },
  });

  return { message: "Registrasi berhasil", user: { id: newUser.id, email: newUser.email } };
}

export async function login( {email, password }: LoginDTO) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User tidak ditemukan");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Password salah");

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET || "supersecretjwt",
    { expiresIn: "24h" }
  );

  return { message: "Login berhasil", token };
}
