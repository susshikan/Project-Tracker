import express from 'express'
import passport from 'passport'
import { getCommit } from '../controllers/commiControllersr'

const commitRouter = express.Router()

commitRouter.get('/', passport.authenticate('jwt', {session: false}), getCommit)

export default commitRouter