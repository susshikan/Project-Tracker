import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from '@prisma/client'

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
