import { useEffect, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Route, Routes } from "react-router"
import "./App.css"
import { Provider, useDispatch } from "react-redux"
import { store } from "./redux/store"
import LoginPage from "./components/pages/loginPage/LoginPage"
// import { ThemeProvider, CssBaseline } from "@mui/material"
// import theme from "./themes"
import DashboardAdmin from "./components/pages/dashboards/admin/DashboardAdmin"
import PasswordForgot from "./components/pages/passwordForgot/PasswordForgot"
import ErrorPage from "./components/pages/error/ErrorPage"
// import Home from "./components/pages/dashboard/home/Home"
import SignUpPage from "./components/pages/signupPage/SignUpPage"
import DashboardUser from "./components/pages/dashboards/user/DashboardUser"
import { listenToAuthState } from "./redux/slices/authSlice"
import ProtectedRoute from "./components/reusable-ui/ProtectedRoute"
import DashboardLogistician from "./components/pages/dashboards/logistician/DashboardLogistician"

import DashboardGestionnaire from "./components/pages/dashboards/gestionnaire/DashboardGestionnaire"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    let isMounted = true
    console.log("🚀 useEffect de l'auth s'exécute")

    if (isMounted) {
      dispatch(listenToAuthState()) // Vérifie l'utilisateur connecté
    }

    return () => {
      isMounted = false // Empêche le second appel
    }
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/passwordforgot" element={<PasswordForgot />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/signup" element={<SignUpPage />} />
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
  )
}

export default App
