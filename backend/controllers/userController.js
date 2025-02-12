import UserService from "../services/userService.js"

export const getUserProfile = async (req, res) => {
  try {
    const user = await UserService.getUserProfile(req.user.id)
    console.log("user from userController", user)
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createUser = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await UserService.createUser(req.body)
    console.log("newUser depuis controller", newUser)
    res.status(201).json({ message: "Utilisateur créé avec succès", newUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body)
    res.status(200).json({ message: "Utilisateur mis à jour", updatedUser })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id)
    res.status(200).json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
