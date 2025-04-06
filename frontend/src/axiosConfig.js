import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // ✅ Envoie automatiquement les cookies (_csrf)
})

// 💡 On garde la possibilité d'injecter dynamiquement le token CSRF
let csrfToken = null

export const setCsrfToken = (token) => {
  csrfToken = token
  axiosInstance.defaults.headers.common["X-CSRF-Token"] = token
}

export default axiosInstance
