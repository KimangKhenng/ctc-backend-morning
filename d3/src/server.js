import express from 'express';

import router from './routes/index.js';
import { fail, ok } from './utils/helpers.js';

const app = express()
const PORT = 3000

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.get('/', (req, res) => {
    ok(res, 200, 'Blog API is running')
})

app.use('/api', router)


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
