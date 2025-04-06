import { useEffect } from "react"
import { Route, Routes } from "react-router"
import { useDispatch } from "react-redux"
import { io } from "socket.io-client"
import Cookies from "js-cookie" // ← Assure-toi que l’instance est bien importée
import "./App.css"

import LoginPage from "./components/pages/loginPage/LoginPage"
import DashboardAdmin from "./components/pages/dashboards/admin/DashboardAdmin"
import DashboardUser from "./components/pages/dashboards/user/DashboardUser"
import DashboardLogistician from "./components/pages/dashboards/logistician/DashboardLogistician"
import DashboardGestionnaire from "./components/pages/dashboards/gestionnaire/DashboardGestionnaire"
import ErrorPage from "./components/pages/error/ErrorPage"
import ProtectedRoute from "./components/reusable-ui/ProtectedRoute"
import StockUpdater from "./components/sockets/StockUpdater"
import NotificationSnackbar from "./components/error/notificationSnackbar"
import axiosInstance from "./axiosConfig"
import { setCsrfToken } from "./axiosConfig"

function App() {
  const dispatch = useDispatch()
  const socket = io("http://localhost:5000")

  // 🔐 Génération du token CSRF au démarrage
  useEffect(() => {
    const loadCsrfToken = async () => {
      try {
        const res = await axiosInstance.get("/csrf_token")
        const csrfToken = res.data.csrfToken
        setCsrfToken(csrfToken) // ✅ Définit le token dans les headers
        console.log("✅ Token CSRF chargé :", csrfToken)
      } catch (err) {
        console.error("❌ Erreur lors du chargement du token CSRF :", err)
      }
    }

    loadCsrfToken()
  }, [])

  // 🔌 WebSocket listeners
  useEffect(() => {
    socket.on("connection", () => {})
    socket.on("disconnect", () => {})

    return () => {
      socket.off("connection")
      socket.off("disconnect")
    }
  }, [])

  return (
    <>
      <NotificationSnackbar />
      <StockUpdater />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <DashboardUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logisticien-dashboard"
          element={
            <ProtectedRoute>
              <DashboardLogistician />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestionnaire-dashboard"
          element={
            <ProtectedRoute>
              <DashboardGestionnaire />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
