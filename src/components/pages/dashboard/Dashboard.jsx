import { Link } from "react-router"
import LoginPage from "../loginPage/LoginPage"
import { Button } from "@mui/material"

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
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
