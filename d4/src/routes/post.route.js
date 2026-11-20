import express from 'express'
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/post.controller.js'
import { getPostComments, createPostComment } from '../controllers/comment.controller.js'
import { getPostLikes, likePost, unlikePost } from '../controllers/like.controller.js'

const postRoute = express.Router()

postRoute.get('/', getAllPosts)
postRoute.post('/', createPost)
postRoute.get('/:id', getPostById)
postRoute.put('/:id', updatePost)
postRoute.delete('/:id', deletePost)

postRoute.get('/:postId/comments', getPostComments)
postRoute.post('/:postId/comments', createPostComment)

postRoute.get('/:postId/likes', getPostLikes)
postRoute.post('/:postId/likes', likePost)
postRoute.delete('/:postId/likes', unlikePost)

export default postRoute
