import React, { useState } from "react"
import { Link } from "react-router"
import { Button } from "@mui/material"
import Menu from "../../reusable-ui/Menu"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import DashboardIcon from "@mui/icons-material/Dashboard"

function Dashboard() {
  const [currentContent, setCurrentContent] = useState(
    "Welcome to the Dashboard"
  )

  const handleLinkClick = (path) => {
    if (path === "/dashboard") {
      setCurrentContent("This is the Dashboard view")
    } else if (path === "/orders") {
      setCurrentContent("This is the Orders view")
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <Menu links={links} onLinkClick={handleLinkClick} />
      <div style={{ marginTop: "20px" }}>
        <h2>Content Area</h2>
        <p>{currentContent}</p>
      </div>
      <Link to="/">
        <Button
          sx={{
            marginTop: 2,
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Déconnexion
        </Button>
      </Link>
    </div>
  )
}

export default Dashboard
