import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './routes/index.js';
import { fail, ok } from './utils/helpers.js';
import { errorHandler } from './middlewares/index.js';

const app = express()
const PORT = 3000

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined'));
app.use(helmet());

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
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
