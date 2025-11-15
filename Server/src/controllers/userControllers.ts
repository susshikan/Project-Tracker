import { Request, Response } from "express";
import { UserRequest } from "../types/userType";
import { PrismaClient } from '../../generated/prisma'
import redis from "../utils/redis";

const prisma = new PrismaClient();

interface updateProfileBody {
  name?: string
  email?: string
  bio?: string
}

export async function getProfile(req: Request, res: Response) {
  const reqUser = req as UserRequest
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({
    message: "Akses diterima",
    user: {
      id: reqUser.user.id,
      email: reqUser.user.email,
      name: reqUser.user.name,
      bio: reqUser.user.bio
    },
  });
}


export async function updateProfile(req: Request<{}, {}, updateProfileBody>, res: Response) {
  const reqUser = req as UserRequest
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const key = `user:${reqUser.user.id}`
  const name = req.body.name
  const email = req.body.email
  const bio = req.body.bio
  let body: { name?: string, email?: string, bio?: string } = {}
  if (name) {
    body.name = name
  }
  if (email) {
    body.email = email
  }
  if (bio) {
    body.bio = bio
  }
  if (!(name || email || bio)) {
    return res.json({users: "nothing to update"})
  }
  try {
    const update = await prisma.user.update({
      where: {
        id: reqUser.user.id
      },
      data: body
    })
    const data = {
      users: update
    }
    await redis.set(key, JSON.stringify(data), 'EX', 120 )
    res.json({users: update})
  } catch (error) {
    console.log(error)
  }


}