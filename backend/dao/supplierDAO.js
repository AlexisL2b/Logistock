import Supplier from "../models/supplierModel.js"
import Product from "../models/productModel.js"
import mongoose from "mongoose"

class SupplierDAO {
  async findAll() {
    return await Supplier.find()
  }

  async findById(id) {
    return await Supplier.findById(id)
  }

  async create(supplierData) {
    const newSupplier = new Supplier(supplierData)
    return await newSupplier.save()
  }

  async update(id, supplierData) {
    return await Supplier.findByIdAndUpdate(id, supplierData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Supplier.findByIdAndDelete(id)
  }

  async findAssociatedProducts(supplierId) {
    return await Product.find({
      supplier_id: new mongoose.Types.ObjectId(supplierId),
    })
  }
}

export default new SupplierDAO()
