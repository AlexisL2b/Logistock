import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // console.log("✅ Token ajouté aux headers :", config.headers.Authorization) // Vérification ici
    } else {
      // console.warn("⚠️ Aucun token trouvé dans le localStorage !")
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
