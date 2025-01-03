import React from "react"
import { Link } from "react-router"
import LoginPage from "../loginPage/LoginPage"

export default function ErrorPage() {
  return (
    <Link to="/" element={<LoginPage />}>
      Erreur 404, retour sur la page de login
    </Link>
  )
}
