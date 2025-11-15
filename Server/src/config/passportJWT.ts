import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient, Prisma } from "../../generated/prisma";
import redis from "../utils/redis";

const prisma = new PrismaClient();

export function setupJwt(passport: any) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "supersecretjwt",
  };
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {

      const key = `user:${payload.sub}`
      const cached = await redis.get(key);
      if (cached) {
        console.timeEnd("passport");
        return done(null, JSON.parse(cached))
      }
      try {
        const user = await prisma.user.findUnique(
          {
            where: {
              id: payload.sub
            },
            select: {
              id: true,
              name: true,
              email: true,
              bio: true
            }
          }
        );
        if (!user) return done(null, false);
        await redis.set(key, JSON.stringify(user), 'EX', 120)
        return done(null, user);
      } catch (err) {
        done(err, false);
      }
    })
  );
}
