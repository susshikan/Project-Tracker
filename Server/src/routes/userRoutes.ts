import express from 'express'
import passport from 'passport'
import { getProfile, updateProfile } from '../controllers/userControllers'
import { RequestHandler } from "express";
import { UserRequest } from '../types/userType';

const userRouter = express.Router()


userRouter.get('/profile', passport.authenticate('jwt', { session: false }), getProfile)
userRouter.post('/profile', passport.authenticate('jwt', { session: false }), updateProfile)
export default userRouter