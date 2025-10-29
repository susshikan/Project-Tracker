import { PrismaClient } from '../generated/prisma'
import express, {Request, Response} from "express";
import cors from "cors"
import userRouter from './routes/userRoutes';
import authRouter from './routes/authRoutes';

const port = 3001;
const app = express();
const prisma = new PrismaClient();

app.use(cors({}));
app.use(express.json());

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});