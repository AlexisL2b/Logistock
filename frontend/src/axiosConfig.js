import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 🔥 Active l'envoi des cookies automatiquement
})

axiosInstance.interceptors.request.use(
  (config) => {
    // Suppression de la récupération du token via localStorage
    console.log("✅ Requête envoyée avec les cookies activés")
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
