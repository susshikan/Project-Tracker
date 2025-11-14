import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient, Prisma } from "../../generated/prisma";

const prisma = new PrismaClient();

export function setupJwt(passport: any) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "supersecretjwt",
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
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
        return done(null, user);
      } catch (err) {
        done(err, false);
      }
    })
  );
}
