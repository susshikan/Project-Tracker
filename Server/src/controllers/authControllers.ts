import { Request, Response } from "express";
import * as authService from "../services/authService";

interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

export async function registerUser(req: Request<{}, {}, RegisterDTO>, res: Response) {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    res.status(400).json({ error: message });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    res.status(401).json({ error: message });
  }
}
