import express from 'express';

import { posts, likes, categories, comments } from './db.js';

const app = express()

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.post('/api/posts', (req, res) => {
    console.log(req.body)
    res.send("Hello post")
})

app.get('/api/posts', (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "Post retrieved successfully",
        "data": posts
    })
})

app.get('/api/posts/:id', (req, res) => {
    const Id = req.params.id
    const post = posts.find((item) => {
        return item.id == Id
    })
    if (!post) {
        return res.status(404).json({
            "success": false,
            "message": "Post not found"
        })
    }
    return res.json({
        "success": true,
        "message": "Post retrieved successfully",
        "data": post
    })
})

app.get('/hello', (req, res) => {
    res.status(202).send("<h1>Hello</h1>")
})
app.get('/json-hello', (req, res) => {
    res.json({
        message: "Hello"
    })
})
app.listen(3000, () => {
    console.log("Server running on port 3000")
})