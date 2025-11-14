import jwt from "jsonwebtoken";

export function generateToken(userId: any, email: any) {
  return jwt.sign(
    { sub: userId, email },
    process.env.JWT_SECRET || "supersecretjwt",
    { expiresIn: "24h" }
  );
}

export function verifyToken(token: any) {
  return jwt.verify(token, process.env.JWT_SECRET || "supersecretjwt");
}
