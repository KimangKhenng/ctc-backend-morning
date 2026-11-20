import express from 'express'
import { updateComment, deleteComment } from '../controllers/comment.controller.js'

const commentRoute = express.Router()

commentRoute.put('/:id', updateComment)
commentRoute.delete('/:id', deleteComment)

export default commentRoute
