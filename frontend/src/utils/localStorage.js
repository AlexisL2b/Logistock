// Sauvegarde l'état dans localStorage
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage :", error)
  }
}

// Récupère l'état depuis localStorage
export const loadFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return undefined // Retourne undefined si aucune donnée n'est trouvée
    }
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage :", error)
    return undefined
  }
}

export const getFromLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error("Erreur lors de la récupération depuis localStorage", error)
    return null
  }
}

export const loadUserFromLocalStorage = () => {
  try {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("id"))
    if (keys.length > 0) {
      const userData = localStorage.getItem(keys[0])
      return userData ? JSON.parse(userData) : null
    }
    return null
  } catch (error) {
    console.error("Erreur lors du chargement des données utilisateur :", error)
    return null
  }
}
