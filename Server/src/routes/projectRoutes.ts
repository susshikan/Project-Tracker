import express from 'express'
import passport from 'passport'
import { getProject, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectControllers'
import { getCommit, getCommitById, getCommitPerProject, updateCommit, deleteCommit, createCommit } from '../controllers/commiControllersr'

const projectRouter = express.Router()

projectRouter.get('/', passport.authenticate('jwt', {session: false}), getProject)
projectRouter.post('/', passport.authenticate('jwt', {session: false}), createProject)
projectRouter.get('/:id', passport.authenticate('jwt', {session: false}), getProjectById)
projectRouter.put('/:id', passport.authenticate('jwt', {session: false}), updateProject)
projectRouter.delete('/:id', passport.authenticate('jwt', {session: false}), deleteProject)

projectRouter.get('/:projectId/commits', passport.authenticate('jwt', {session: false}), getCommitPerProject)
projectRouter.post('/:projectId/commits', passport.authenticate('jwt', {session: false}), createCommit)

projectRouter.get('/:projectId/commits/:commitId', passport.authenticate('jwt', {session: false}), getCommitById)
projectRouter.put('/:projectId/commits/:commitId', passport.authenticate('jwt', {session: false}), updateCommit)
projectRouter.delete('/:projectId/commits/:commitId', passport.authenticate('jwt', {session: false}), deleteCommit)

export default projectRouter