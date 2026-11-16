// Generic helpers with no knowledge of the data model.

// Every response uses the same shape: { success, message, data } or { success, message }
export const ok = (res, status, message, data) =>
    res.status(status).json({ success: true, message, data })

export const fail = (res, status, message) =>
    res.status(status).json({ success: false, message })

// Next free id: one more than the largest existing id (ids stay unique after deletes)
export const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1

export const findById = (list, id) => list.find((item) => item.id === id)

// Remove every item that matches the test, in place
export const removeWhere = (list, test) => {
    for (let i = list.length - 1; i >= 0; i--) {
        if (test(list[i])) list.splice(i, 1)
    }
}

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== ''

// "UI Design" -> "ui-design"
export const slugify = (name) =>
    name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Accepts a positive integer userId sent as a number or a numeric string; returns null otherwise
export const parseUserId = (value) => {
    if (value === undefined || value === null || value === '') return null
    const userId = Number(value)
    return Number.isInteger(userId) && userId > 0 ? userId : null
}
