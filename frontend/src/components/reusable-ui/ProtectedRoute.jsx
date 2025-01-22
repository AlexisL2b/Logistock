import React from "react"
import { Navigate } from "react-router"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children }) => {
  // Récupérer l'utilisateur dans localStorage avec une clé dynamique
  const getUserFromLocalStorage = () => {
    const keys = Object.keys(localStorage) // Récupère toutes les clés du localStorage
    const userKey = keys.find((key) => key.startsWith("user_")) // Trouve la clé qui commence par "user_"
    if (userKey) {
      const userData = localStorage.getItem(userKey)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  const localStorageUser = getUserFromLocalStorage()

  // Si aucun utilisateur trouvé dans le localStorage, on prend l'utilisateur depuis Redux
  const reduxUser = useSelector((state) => state.auth.user)
  const status = useSelector((state) => state.auth.status)

  const user = localStorageUser || reduxUser

  if (status === "loading") {
    // Afficher un écran de chargement pendant l'initialisation
    return <div>Chargement...</div>
  }

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/" />
  }

  // Afficher la route protégée
  return children
}

export default ProtectedRoute
