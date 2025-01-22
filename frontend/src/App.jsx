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
// import Dashboard from "./components/pages/dashboard/Dashboard"
import PasswordForgot from "./components/pages/passwordForgot/PasswordForgot"
import ErrorPage from "./components/pages/error/ErrorPage"
// import Home from "./components/pages/dashboard/home/Home"
import SignUpPage from "./components/pages/signupPage/SignUpPage"
import DashboardUser from "./components/pages/dashboards/user/DashboardUser"
import { listenToAuthState } from "./redux/slices/authSlice"
import ProtectedRoute from "./components/reusable-ui/ProtectedRoute"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listenToAuthState()) // Vérifie l'utilisateur connecté
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
    </Routes>
  )
}

export default App
