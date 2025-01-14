import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import { Route, Routes } from "react-router"
import "./App.css"
import { Provider } from "react-redux"
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Provider store={store}>
        {/* <ThemeProvider theme={theme}> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/dashboard/*" element={<Dashboard />} /> */}
          <Route path="/passwordforgot" element={<PasswordForgot />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/user-dashboard" element={<DashboardUser />} />
        </Routes>
        {/* </ThemeProvider> */}
      </Provider>
    </>
  )
}

export default App
