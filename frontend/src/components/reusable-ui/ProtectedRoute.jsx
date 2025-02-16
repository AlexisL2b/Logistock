import React, { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserProfile } from "../../redux/slices/authSlice"

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(fetchUserProfile()).unwrap()
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [dispatch])

  if (isLoading || loading) {
    return <p>Chargement...</p> // Affiche un loader pendant la récupération des infos utilisateur
  }

  if (!user) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
