import express from 'express'
import passport from 'passport'
import { getProject, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectControllers'

const projectRouter = express.Router()

projectRouter.get('/', passport.authenticate('jwt', {session: false}), getProject)
projectRouter.post('/', passport.authenticate('jwt', {session: false}), createProject)
projectRouter.get('/:id', passport.authenticate('jwt', {session: false}), getProjectById)
projectRouter.put('/:id', passport.authenticate('jwt', {session: false}), updateProject)
projectRouter.delete('/:id', passport.authenticate('jwt', {session: false}), deleteProject)

projectRouter.get('/:projectId/commits')
projectRouter.post('/:projectId/commits')

projectRouter.get('/:projectid/commits/:commitid')
projectRouter.put('/:projectid/commits/:commitid')
projectRouter.delete('/:projectid/commits/:commitid')

export default projectRouter