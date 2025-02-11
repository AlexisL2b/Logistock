import Transporter from "../models/transporterModel.js"

class TransporterDAO {
  async findAll() {
    return await Transporter.find()
  }

  async findById(id) {
    return await Transporter.findById(id)
  }

  async create(transporterData) {
    const newTransporter = new Transporter(transporterData)
    return await newTransporter.save()
  }

  async update(id, transporterData) {
    return await Transporter.findByIdAndUpdate(id, transporterData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Transporter.findByIdAndDelete(id)
  }
}

export default new TransporterDAO()
