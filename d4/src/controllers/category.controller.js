import { categoryModel } from '../models/category.model.js'
import { fail, findById, isNonEmptyString, nextId, ok, slugify } from '../utils/helpers.js'

export const getAllCategories = async (req, res) => {
    const categories = await categoryModel.find()
    ok(res, 200, 'Categories retrieved successfully', categories)
}

export const getCategoryById = async (req, res) => {
    // const category = findById(categories, Number(req.params.id))
    const category = await categoryModel.findById(req.params.id)
    if (!category) return fail(res, 404, 'Category not found')

    ok(res, 200, 'Category retrieved successfully', category)
}

export const createCategory = async (req, res) => {
    const { name, description = '' } = req.body ?? {}

    if (!isNonEmptyString(name)) return fail(res, 400, 'Category name is required')
    if (typeof description !== 'string') return fail(res, 400, 'Description must be a string')

    const exists = categories.some((item) => item.name.toLowerCase() === name.trim().toLowerCase())
    if (exists) return fail(res, 409, 'Category name already exists')

    const category = {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
    }
    // categories.push(category)
    const newCategory = new categoryModel(category)
    await newCategory.save()

    ok(res, 201, 'Category created successfully', category)
}

export const updateCategory = async (req, res) => {
    // const category = findById(categories, Number(req.params.id))
    // if (!category) return fail(res, 404, 'Category not found')

    const { name, description } = req.body ?? {}
    const updates = {
        name,
        description
    }

    const category = await categoryModel.findByIdAndUpdate(req.params.id, updates)

    // Object.assign(category, updates)

    ok(res, 200, 'Category updated successfully', category)
}

export const deleteCategory = async (req, res) => {
    const reuslt = await categoryModel.findByIdAndDelete(req.params.id)
    ok(res, 200, 'Category deleted successfully', reuslt)
}
