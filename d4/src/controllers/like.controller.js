import { likes, posts } from '../models/db.js'
import { fail, findById, nextId, ok, parseUserId } from '../utils/helpers.js'
import { countLikes } from '../services/like.service.js'

// ---------- Under /posts/:postId/likes ----------

export const getPostLikes = (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const postLikes = likes.filter((like) => like.postId === post.id)
    ok(res, 200, 'Likes retrieved successfully', {
        postId: post.id,
        totalLikes: postLikes.length,
        users: postLikes.map((like) => like.userId),
    })
}

export const likePost = (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const userId = parseUserId(req.body?.userId)
    if (userId === null) return fail(res, 400, 'A valid userId is required')

    const alreadyLiked = likes.some((like) => like.postId === post.id && like.userId === userId)
    if (alreadyLiked) return fail(res, 409, 'User has already liked this post')

    likes.push({ id: nextId(likes), postId: post.id, userId })

    ok(res, 201, 'Post liked successfully', {
        postId: post.id,
        userId,
        totalLikes: countLikes(post.id),
    })
}

export const unlikePost = (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const userId = parseUserId(req.body?.userId)
    if (userId === null) return fail(res, 400, 'A valid userId is required')

    const index = likes.findIndex((like) => like.postId === post.id && like.userId === userId)
    if (index === -1) return fail(res, 404, 'Like not found')

    likes.splice(index, 1)

    ok(res, 200, 'Post unliked successfully', {
        postId: post.id,
        userId,
        totalLikes: countLikes(post.id),
    })
}
