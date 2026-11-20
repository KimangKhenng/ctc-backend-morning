import express from 'express'
import postRoute from './post.route.js'
import categoryRoute from './category.route.js'
import commentRoute from './comment.route.js'
import { logger } from '../middlewares/index.js'

const router = express.Router()

router.use('/posts', postRoute)
router.use('/categories', categoryRoute)
router.use('/comments', commentRoute)

export default router