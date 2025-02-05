import Category from "../models/categoryModel.js"

class CategoryDAO {
  async findAll() {
    return await Category.find()
  }

  async getById(id) {
    return await Category.findById(id)
  }

  async create(categoryData) {
    const newCategory = new Category(categoryData)
    return await newCategory.save()
  }

  async update(id, categoryData) {
    return await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id)
  }
}

export default new CategoryDAO()
