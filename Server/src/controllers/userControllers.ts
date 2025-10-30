import { Request, Response } from "express";
import { UserRequest } from "../types/userType";


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
    },
  });
}

export async function updateProfile(){
  
}