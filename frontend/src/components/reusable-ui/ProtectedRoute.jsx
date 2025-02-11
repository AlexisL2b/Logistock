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

  const reduxUser = useSelector((state) => state.auth.user)

  const user = reduxUser
  // console.log("user from redux", user)
  if (!user) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
