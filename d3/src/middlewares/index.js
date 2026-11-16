import { fail } from "../utils/helpers.js"

export const logger = (req, res, next) => {
    console.log("Hello Middleware")
    next()
}

export const logger2 = (req, res, next) => {
    if (req.query.pass === '1') {
        next()
    } else {
        res.status(400).send("Bad request")
    }
}

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err)

    // express.json() throws this when the request body is not valid JSON
    if (err.type === 'entity.parse.failed') {
        return fail(res, 400, 'Request body must be valid JSON')
    }

    console.error(err)
    fail(res, 500, 'Something went wrong on the server')
}