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

projectRouter.get('/:projectId/commits', getCommitPerProject)
projectRouter.post('/:projectId/commits', createCommit)

projectRouter.get('/:projectId/commits/:commitId', getCommitById)
projectRouter.put('/:projectId/commits/:commitId', updateCommit)
projectRouter.delete('/:projectId/commits/:commitId', deleteCommit)

export default projectRouter