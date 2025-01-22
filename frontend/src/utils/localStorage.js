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