import { categories, posts } from '../models/db.js'
import { fail, findById, isNonEmptyString, nextId, ok, slugify } from '../utils/helpers.js'

export const getAllCategories = (req, res) => {
    ok(res, 200, 'Categories retrieved successfully', categories)
}

export const getCategoryById = (req, res) => {
    const category = findById(categories, Number(req.params.id))
    if (!category) return fail(res, 404, 'Category not found')

    ok(res, 200, 'Category retrieved successfully', category)
}

export const createCategory = (req, res) => {
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
}

export const updateCategory = (req, res) => {
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
}

export const deleteCategory = (req, res) => {
    const index = categories.findIndex((item) => item.id === Number(req.params.id))
    if (index === -1) return fail(res, 404, 'Category not found')

    // Refuse to delete a category that posts still use, so no post is left without a valid category
    const inUse = posts.some((post) => post.categoryId === categories[index].id)
    if (inUse) return fail(res, 409, 'Category is used by posts and cannot be deleted')

    const [removed] = categories.splice(index, 1)

    ok(res, 200, 'Category deleted successfully', { id: removed.id })
}
