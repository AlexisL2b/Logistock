import React, { useState } from "react"
import Form from "../../../reusable-ui/Form"
import { Box, Button, ButtonGroup } from "@mui/material"

export default function Categories() {
  const [isVisible, setIsVisible] = useState("synthèse")

  const handleVisible = (e, activeContent) => {
    e.preventDefault()
    setIsVisible(activeContent)
  }
  const handleSubmit = () => {
    console.log("Je viens de sumbit mon form")
  }
  return (
    <Box>
      <ButtonGroup
        disableElevation
        variant="contained"
        aria-label="Disabled button group"
      >
        <Button onClick={(e) => handleVisible(e, "ajout")}>Ajouter</Button>
        <Button onClick={(e) => handleVisible(e, "synthèse")}>Synthèse</Button>
      </ButtonGroup>
      {isVisible == "ajout" ? (
        <Form action="submit" onSubmit={handleSubmit} />
      ) : (
        ""
      )}
      {isVisible == "synthèse" ? <p>Je suis une synthèse</p> : ""}
    </Box>
  )
}
