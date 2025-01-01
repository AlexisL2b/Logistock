import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Route, Routes } from "react-router"
import "./App.css"
import LoginPage from "./components/pages/loginPage/LoginPage"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./themes"
import Dashboard from "./components/pages/dashboard/Dashboard"
import PasswordForgot from "./components/pages/passwordForgot/PasswordForgot"
import ErrorPage from "./components/pages/error/ErrorPage"

function App() {
  const [count, setCount] = useState(0)
  console.log("Thème chargé :", theme)

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/passwordforgot" element={<PasswordForgot />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
