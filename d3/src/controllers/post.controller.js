import { categories, comments, likes, posts } from '../models/db.js'
import { fail, findById, isNonEmptyString, nextId, ok, removeWhere } from '../utils/helpers.js'
import { withLikes } from '../services/like.service.js'

export const getAllPosts = (req, res) => {
    ok(res, 200, 'Posts retrieved successfully', posts.map(withLikes))
}

export const getPostById = (req, res) => {
    const post = findById(posts, Number(req.params.id))
    if (!post) return fail(res, 404, 'Post not found')

    ok(res, 200, 'Post retrieved successfully', withLikes(post))
}

export const createPost = (req, res) => {
    const { title, content, author, categoryId } = req.body ?? {}

    if (!isNonEmptyString(title) || !isNonEmptyString(content) ||
        !isNonEmptyString(author) || categoryId === undefined || categoryId === null) {
        return fail(res, 400, 'Title, content, author, and categoryId are required')
    }
    if (!findById(categories, Number(categoryId))) {
        return fail(res, 400, 'Category not found')
    }

    const now = new Date().toISOString()
    const post = {
        id: nextId(posts),
        title: title.trim(),
        content: content.trim(),
        author: author.trim(),
        categoryId: Number(categoryId),
        createdAt: now,
        updatedAt: now,
    }
    posts.push(post)

    ok(res, 201, 'Post created successfully', withLikes(post))
}

export const updatePost = (req, res) => {
    const post = findById(posts, Number(req.params.id))
    if (!post) return fail(res, 404, 'Post not found')

    // Validate everything first so a bad field does not leave the post half-updated
    const { title, content, author, categoryId } = req.body ?? {}
    const updates = {}

    if (title !== undefined) {
        if (!isNonEmptyString(title)) return fail(res, 400, 'Title cannot be empty')
        updates.title = title.trim()
    }
    if (content !== undefined) {
        if (!isNonEmptyString(content)) return fail(res, 400, 'Content cannot be empty')
        updates.content = content.trim()
    }
    if (author !== undefined) {
        if (!isNonEmptyString(author)) return fail(res, 400, 'Author cannot be empty')
        updates.author = author.trim()
    }
    if (categoryId !== undefined) {
        if (!findById(categories, Number(categoryId))) return fail(res, 400, 'Category not found')
        updates.categoryId = Number(categoryId)
    }
    if (Object.keys(updates).length === 0) {
        return fail(res, 400, 'No valid fields to update')
    }

    Object.assign(post, updates, { updatedAt: new Date().toISOString() })

    ok(res, 200, 'Post updated successfully', withLikes(post))
}

export const deletePost = (req, res) => {
    const index = posts.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Post not found')

    const [removed] = posts.splice(index, 1)
    // Also remove the post's comments and likes so nothing points at a missing post
    removeWhere(comments, (comment) => comment.postId === removed.id)
    removeWhere(likes, (like) => like.postId === removed.id)

    ok(res, 200, 'Post deleted successfully', { id: removed.id })
}
