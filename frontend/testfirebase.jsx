import { getAuth } from "firebase/auth"
import { useEffect } from "react"

const TestFirebaseAuth = () => {
  useEffect(() => {
    const auth = getAuth()
    console.log("Utilisateur Firebase après refresh :", auth.currentUser)
  }, [])

  return null
}

export default TestFirebaseAuth
