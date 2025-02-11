export const test = async (req, res) => {
  try {
    res.json({ message: "oui l'api fonctionne" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
