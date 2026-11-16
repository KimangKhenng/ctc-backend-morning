import express from 'express';

import { posts, likes, categories, comments } from './db.js';

const app = express()
const PORT = 3000

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ---------- Helpers ----------

// Every response uses the same shape: { success, message, data } or { success, message }
const ok = (res, status, message, data) =>
    res.status(status).json({ success: true, message, data })

const fail = (res, status, message) =>
    res.status(status).json({ success: false, message })

// Next free id: one more than the largest existing id (ids stay unique after deletes)
const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1

const findById = (list, id) => list.find((item) => item.id === id)

// Remove every item that matches the test, in place
const removeWhere = (list, test) => {
    for (let i = list.length - 1; i >= 0; i--) {
        if (test(list[i])) list.splice(i, 1)
    }
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== ''

const likeCount = (postId) => likes.filter((like) => like.postId === postId).length

// Posts do not store a like count; it is calculated from the likes list
const withLikes = (post) => ({ ...post, likes: likeCount(post.id) })

// "UI Design" -> "ui-design"
const slugify = (name) =>
    name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Accepts a positive integer userId sent as a number or a numeric string; returns null otherwise
const parseUserId = (value) => {
    if (value === undefined || value === null || value === '') return null
    const userId = Number(value)
    return Number.isInteger(userId) && userId > 0 ? userId : null
}

// ---------- Root ----------

app.get('/', (req, res) => {
    ok(res, 200, 'Blog API is running')
})

// ---------- Posts ----------

app.get('/api/posts', (req, res) => {
    ok(res, 200, 'Posts retrieved successfully', posts.map(withLikes))
})

app.get('/api/posts/:id', (req, res) => {
    const post = findById(posts, Number(req.params.id))
    if (!post) return fail(res, 404, 'Post not found')

    ok(res, 200, 'Post retrieved successfully', withLikes(post))
})

app.post('/api/posts', (req, res) => {
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
})

app.put('/api/posts/:id', (req, res) => {
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
})

app.delete('/api/posts/:id', (req, res) => {
    const index = posts.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Post not found')

    const [removed] = posts.splice(index, 1)
    // Also remove the post's comments and likes so nothing points at a missing post
    removeWhere(comments, (comment) => comment.postId === removed.id)
    removeWhere(likes, (like) => like.postId === removed.id)

    ok(res, 200, 'Post deleted successfully', { id: removed.id })
})

// ---------- Comments ----------

app.get('/api/posts/:postId/comments', (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const postComments = comments.filter((comment) => comment.postId === post.id)
    ok(res, 200, 'Comments retrieved successfully', postComments)
})

app.post('/api/posts/:postId/comments', (req, res) => {
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
})

app.put('/api/comments/:id', (req, res) => {
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
})

app.delete('/api/comments/:id', (req, res) => {
    const index = comments.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Comment not found')

    const [removed] = comments.splice(index, 1)

    ok(res, 200, 'Comment deleted successfully', { id: removed.id })
})

// ---------- Categories ----------

app.get('/api/categories', (req, res) => {
    ok(res, 200, 'Categories retrieved successfully', categories)
})

app.get('/api/categories/:id', (req, res) => {
    const category = findById(categories, Number(req.params.id))
    if (!category) return fail(res, 404, 'Category not found')

    ok(res, 200, 'Category retrieved successfully', category)
})

app.post('/api/categories', (req, res) => {
    const { name, description = '' } = req.body ?? {}

    if (!isNonEmptyString(name)) return fail(res, 400, 'Category name is required')
    if (typeof description !== 'string') return fail(res, 400, 'Description must be a string')

    const exists = categories.some((item) => item.name.toLowerCase() === name.trim().toLowerCase())
    if (exists) return fail(res, 409, 'Category name already exists')

    const category = {
        id: nextId(categories),
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
    }
    categories.push(category)

    ok(res, 201, 'Category created successfully', category)
})

app.put('/api/categories/:id', (req, res) => {
    const category = findById(categories, Number(req.params.id))
    if (!category) return fail(res, 404, 'Category not found')

    const { name, description } = req.body ?? {}
    const updates = {}

    if (name !== undefined) {
        if (!isNonEmptyString(name)) return fail(res, 400, 'Category name is required')
        const nameTaken = categories.some((item) =>
            item.id !== category.id && item.name.toLowerCase() === name.trim().toLowerCase())
        if (nameTaken) return fail(res, 409, 'Category name already exists')
        updates.name = name.trim()
        updates.slug = slugify(name)
    }
    if (description !== undefined) {
        if (typeof description !== 'string') return fail(res, 400, 'Description must be a string')
        updates.description = description.trim()
    }
    if (Object.keys(updates).length === 0) {
        return fail(res, 400, 'No valid fields to update')
    }

    Object.assign(category, updates)

    ok(res, 200, 'Category updated successfully', category)
})

app.delete('/api/categories/:id', (req, res) => {
    const index = categories.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Category not found')

    // Refuse to delete a category that posts still use, so no post is left without a valid category
    const inUse = posts.some((post) => post.categoryId === categories[index].id)
    if (inUse) return fail(res, 409, 'Category is used by posts and cannot be deleted')

    const [removed] = categories.splice(index, 1)

    ok(res, 200, 'Category deleted successfully', { id: removed.id })
})

// ---------- Post likes ----------

app.get('/api/posts/:postId/likes', (req, res) => {
    const post = findById(posts, Number(req.params.postId))
    if (!post) return fail(res, 404, 'Post not found')

    const postLikes = likes.filter((like) => like.postId === post.id)
    ok(res, 200, 'Likes retrieved successfully', {
        postId: post.id,
        totalLikes: postLikes.length,
        users: postLikes.map((like) => like.userId),
    })
})

app.post('/api/posts/:postId/likes', (req, res) => {
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
        totalLikes: likeCount(post.id),
    })
})

app.delete('/api/posts/:postId/likes', (req, res) => {
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
        totalLikes: likeCount(post.id),
    })
})

// ---------- Fallbacks and error handling ----------

// Unknown routes get a JSON 404 instead of Express's HTML page
app.use((req, res) => {
    fail(res, 404, 'Route not found')
})

// Global error handler: must keep all four parameters so Express treats it as an error handler
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err)

    // express.json() throws this when the request body is not valid JSON
    if (err.type === 'entity.parse.failed') {
        return fail(res, 400, 'Request body must be valid JSON')
    }

    console.error(err)
    fail(res, 500, 'Something went wrong on the server')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
