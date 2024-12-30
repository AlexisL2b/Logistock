import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Route, Routes } from "react-router"
import "./App.css"
import LoginPage from "./components/pages/LoginPage"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./themes"

function App() {
  const [count, setCount] = useState(0)
  console.log("Thème chargé :", theme)

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
