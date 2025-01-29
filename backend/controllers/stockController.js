import Stock from "../models/stockModel.js"
import mongoose from "mongoose"

// Récupérer tous les stocks

export const decrementStockForOrder = async (orderDetails, io) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    //("Début de la mise à jour des stocks...")

    if (!Array.isArray(orderDetails)) {
      throw new Error("Les détails de la commande doivent être un tableau.")
    }

    const updatedStocks = []

    for (const detail of orderDetails) {
      const { produit_id, quantite } = detail

      const stock = await Stock.findOne({ produit_id }).session(session)
      //("stock from stockController 23", stock)

      if (!stock) {
        throw new Error(`Stock introuvable pour le produit ID: ${produit_id}`)
      }

      if (quantite > stock.quantite_totale) {
        throw new Error(
          `Stock insuffisant pour le produit ID: ${produit_id}. Quantité demandée: ${quantite}, disponible: ${stock.quantite_totale}`
        )
      }

      stock.quantite_totale -= quantite
      await stock.save({ session })

      updatedStocks.push({
        produit_id: stock.produit_id,
        quantite_totale: stock.quantite_totale,
        stockId: stock._id,
      })
    }

    await session.commitTransaction()
    session.endSession()

    // Émettre les stocks mis à jour via Socket.IO
    if (io) {
      io.emit("stocksUpdated", updatedStocks)
    }

    return {
      success: true,
      message: "Stocks mis à jour avec succès",
      updatedStocks,
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des stocks :", error.message)

    if (session.inTransaction()) {
      try {
        await session.abortTransaction()
      } catch (abortError) {
        console.error(
          "Erreur lors de l'abandon de la transaction :",
          abortError
        )
      }
    }

    throw error
  } finally {
    session.endSession()
  }
}

export const checkStockAvailability = async (req, res) => {
  try {
    const orderDetails = req.body.orderDetails

    if (!Array.isArray(orderDetails)) {
      return res.status(400).json({
        message: "Les détails de la commande doivent être un tableau.",
      })
    }

    const insufficientStock = []

    for (const detail of orderDetails) {
      const { produit_id, quantite } = detail

      const stock = await Stock.findOne({ produit_id })

      if (!stock) {
        insufficientStock.push({
          produit_id,
          quantite,
          stockDisponible: 0,
        })
        continue
      }

      if (quantite > stock.quantite_totale) {
        insufficientStock.push({
          produit_id,
          quantite,
          stockDisponible: stock.quantite_totale,
        })
      }
    }

    res.json({ insufficientStock })
  } catch (error) {
    console.error("Erreur lors de la vérification du stock :", error)
    res.status(500).json({
      message: "Erreur lors de la vérification du stock",
      error: error.message,
    })
  }
}
export const getAllStocks = async (req, res) => {
  try {
    //("Requête reçue pour récupérer les stocks")

    // Utilisez `.populate()` avec `.select()` pour n'inclure que l'ID
    const stocks = await Stock.find().populate("produit_id", "_id").lean() // Convertit les documents Mongoose en objets JS simples

    // Transformez `produit_id` pour qu'il ne contienne que l'ID
    const updatedStocks = stocks.map((stock) => ({
      ...stock,
      produit_id: stock.produit_id._id, // Remplace l'objet `produit_id` par son `_id`
    }))

    res.json({
      message: "Stocks récupérés avec succès",
      data: updatedStocks,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des stocks",
      error,
    })
  }
}

// Récupérer un stock par ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id).populate("produit_id")
    if (!stock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }
    res.json({
      message: "Stock récupéré avec succès",
      data: stock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du stock",
      error,
    })
  }
}

// Ajouter un nouveau stock
export const addStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body)
    const savedStock = await newStock.save()
    res.status(201).json({
      message: "Stock ajouté avec succès",
      data: savedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du stock",
      error,
    })
  }
}

// Mettre à jour un stock par ID
export const updateStock = async (req, res) => {
  try {
    //("req.params.id", req.params.id)
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }

    res.json({
      message: "Stock mis à jour avec succès updateStock stockController",
      data: updatedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock",
      error,
    })
  }
}

// Mettre à jour un stock par l'ID du produit
export const updateStockByProductId = async (req, res) => {
  try {
    const { produit_id } = req.params // Récupération de l'ID du produit depuis les paramètres
    const updatedStock = await Stock.findOneAndUpdate(
      { produit_id }, // Trouve le stock correspondant à l'ID du produit
      req.body, // Mise à jour des champs
      {
        new: true, // Renvoie le document mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )

    if (!updatedStock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    res.json({
      message: "Stock mis à jour avec succès pour le produit",
      data: updatedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock par produit",
      error,
    })
  }
}

export const handleStockEntry = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    // Trouver le stock lié au produit
    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    // Ajouter la quantité totale
    stock.quantite_totale += quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Entrée en stock réussie", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res.status(500).json({ message: "Erreur lors de l'entrée en stock", error })
  } finally {
    session.endSession()
  }
}
export const handleOrderReception = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    const quantite_disponible = stock.quantite_totale - stock.quantite_reserve

    if (quantite > quantite_disponible) {
      return res
        .status(400)
        .json({ message: "Stock insuffisant pour cette commande" })
    }

    stock.quantite_reserve += quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Commande reçue avec succès", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors de la réception de commande", error })
  } finally {
    session.endSession()
  }
}
export const handleStockRelease = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    if (quantite > stock.quantite_reserve) {
      return res.status(400).json({ message: "Quantité réservée insuffisante" })
    }

    stock.quantite_totale -= quantite
    stock.quantite_reserve -= quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Sortie de stock réussie", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors de la sortie de stock", error })
  } finally {
    session.endSession()
  }
}

export const handleOrderDispatch = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { produit_id, quantite } = req.body

    const stock = await Stock.findOne({ produit_id }).session(session)

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock introuvable pour ce produit" })
    }

    if (quantite > stock.quantite_reserve) {
      return res
        .status(400)
        .json({ message: "Quantité réservée insuffisante pour le départ" })
    }

    stock.quantite_reserve -= quantite

    await stock.save({ session })
    await session.commitTransaction()

    res.json({ message: "Départ de commande validé", data: stock })
  } catch (error) {
    await session.abortTransaction()
    res
      .status(500)
      .json({ message: "Erreur lors du départ de commande", error })
  } finally {
    session.endSession()
  }
}

// export const updateStockByProductId = async (req, res) => {
//   try {
//     const { produit_id } = req.params
//     //("produit_id", produit_id) // Convertir en ObjectId
//     const existingStock = await Stock.findOne({ produit_id: produit_id })
//     //("Stock trouvé :", existingStock)

//     if (!existingStock) {
//       return res
//         .status(404)
//         .json({ message: "Stock introuvable pour ce produit" })
//     }

//     // const updatedStock = await Stock.findOneAndUpdate(
//     //   { produit_id: produitId }, // Utilisation de l'ObjectId
//     //   req.body,
//     //   {*
//     //     new: true,
//     //     runValidators: true,
//     //   }
//     // )

//     // if (!updatedStock) {
//     //   return res
//     //     .status(404)
//     //     .json({ message: "Stock introuvable pour ce produit" })
//     // }

//     // res.json({
//     //   message: "Stock mis à jour avec succès pour le produit",
//     //   data: updatedStock,
//     // })
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour du stock par produit",
//       error,
//     })
//   }
// }
// Supprimer un stock par ID
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id)
    if (!deletedStock) {
      return res.status(404).json({ message: "Stock introuvable" })
    }
    res.json({
      message: "Stock supprimé avec succès",
      data: deletedStock,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du stock",
      error,
    })
  }
}
