import { Link } from "react-router"
import LoginPage from "../loginPage/LoginPage"
import { Box, Button } from "@mui/material"
import Menu from "../../reusable-ui/Menu"
import DashboardIcon from "@mui/icons-material/Dashboard"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function Dashboard() {
  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/orders", label: "Orders", icon: <ShoppingCartIcon /> },
  ]
  return (
    <Box sx={{ height: "100vh" }}>
      <h1>Dashboard</h1>
      <Box
        sx={{
          display: "flex", // Flexbox pour aligner les enfants
          height: "100%", // Prend toute la hauteur
        }}
        className="dashboardContainer"
      >
        {/* Barre latérale */}
        <Box
          sx={{
            borderRadius: 2,

            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "100%",
            backgroundColor: "background.paper",
          }}
          className="dashboardSideBarre"
        >
          <Menu links={links} />
        </Box>

        {/* Zone principale */}
        <Box
          sx={{
            flex: 1, // Prend tout l'espace restant
            backgroundColor: "white", // Optionnel : couleur de fond
            padding: 2, // Espacement interne
          }}
          className="dashboardMain"
        >
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
        </Box>
      </Box>
    </Box>
  )
}
