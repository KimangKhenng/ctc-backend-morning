import { comments, posts } from '../models/db.js'
import { fail, findById, isNonEmptyString, nextId, ok } from '../utils/helpers.js'

// ---------- Under /posts/:postId/comments ----------

export const getPostComments = (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const postComments = comments.filter((comment) => comment.postId === post.id)
    ok(res, 200, 'Comments retrieved successfully', postComments)
}

export const createPostComment = (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const { author, content } = req.body ?? {}
    if (!isNonEmptyString(author) || !isNonEmptyString(content)) {
        return fail(res, 400, 'Author and content are required')
    }

    const comment = {
        id: nextId(comments),
        postId: post.id,
        author: author.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
    }
    comments.push(comment)

    ok(res, 201, 'Comment created successfully', comment)
}

// ---------- Under /comments/:id ----------

export const updateComment = (req, res) => {
    const comment = findById(comments, Number(req.params.id))
    if (!comment) return fail(res, 404, 'Comment not found')

    const { author, content } = req.body ?? {}
    const updates = {}

    if (author !== undefined) {
        if (!isNonEmptyString(author)) return fail(res, 400, 'Author cannot be empty')
        updates.author = author.trim()
    }
    if (content !== undefined) {
        if (!isNonEmptyString(content)) return fail(res, 400, 'Content cannot be empty')
        updates.content = content.trim()
    }
    if (Object.keys(updates).length === 0) {
        return fail(res, 400, 'No valid fields to update')
    }

    Object.assign(comment, updates)

    ok(res, 200, 'Comment updated successfully', comment)
}

export const deleteComment = (req, res) => {
    const index = comments.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Comment not found')

    const [removed] = comments.splice(index, 1)

    ok(res, 200, 'Comment deleted successfully', { id: removed.id })
}
