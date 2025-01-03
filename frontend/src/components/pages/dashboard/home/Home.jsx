import { Box } from "@mui/material"
import React from "react"
import Form from "../../../reusable-ui/Form"

export default function home() {
  console.log("Le composant Home est bien chargé")
  return (
    <Box sx={{ backgroundColor: "red" }}>
      <Form
        action="submit"
        onSubmit={console.log("Je viens de sumbit mon form")}
      />
    </Box>
  )
}
