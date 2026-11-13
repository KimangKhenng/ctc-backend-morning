import express from 'express';

import { posts, likes, categories, comments } from './db.js';

const app = express()

app.get('/posts', (req, res) => {
    res.status(200).json(posts)
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