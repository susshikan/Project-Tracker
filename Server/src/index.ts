import { PrismaClient } from '../generated/prisma'
import express, {Request, Response} from "express";
import cors from "cors"
import userRouter from './routes/userRoutes';

const port = 3001;
const app = express();
const prisma = new PrismaClient();

app.use(cors({}));
app.use(express.json());

app.use('/api/users', userRouter)

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});