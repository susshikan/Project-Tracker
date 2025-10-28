import express from 'express'
const userRouter = express.Router();
import { createUser, getAllUsers, getUserById } from '../controllers/userControllers';

userRouter.get('/', getAllUsers)
userRouter.post('/', createUser)
userRouter.get('/:id', getUserById)

export default userRouter