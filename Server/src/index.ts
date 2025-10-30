import { PrismaClient } from '../generated/prisma'
import express, {Request, Response} from "express";
import cors from "cors"
import dotenv from "dotenv";
import passport from "passport";
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';
import projectRouter from './routes/projectRoutes';
import { setupJwt } from './config/passportJWT';

const port = 3001;
const app = express();
const prisma = new PrismaClient();
dotenv.config();
app.use(cors({}));
app.use(express.json());
app.use(passport.initialize());
setupJwt(passport)

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});