import { PrismaClient } from '@prisma/client'
import express, {Request, Response} from "express";
import cors from "cors"

const port = 3001;
const app = express();
const prisma = new PrismaClient();

app.use(cors({}));
app.use(express.json());

