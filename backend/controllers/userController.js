import UserService from "../services/userService.js"

// ✅ Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Récupérer uniquement les acheteurs
export const getAllBuyers = async (req, res) => {
  try {
    const buyers = await UserService.getBuyers()
    res.json(buyers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Récupérer un utilisateur par Firebase UID
export const getUserByUid = async (req, res) => {
  try {
    const user = await UserService.getUserByFirebaseUid(req.params.uid)
    res.json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// ✅ Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id)
    res.json(user)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// ✅ Ajouter un utilisateur (gestionnaire ne peut créer que des acheteurs)
export const addUser = async (req, res) => {
  try {
    const creatorRole = req.user.role // Récupère le rôle du créateur
    const newUser = await UserService.addUser(req.body, creatorRole)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ✅ Modifier un utilisateur
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body)
    res.json(updatedUser)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// ✅ Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
