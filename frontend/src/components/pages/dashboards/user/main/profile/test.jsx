const handleSave = async (field) => {
  try {
    if (field === "email" && userProfile.email !== user.email) {
      // Vérifier si l'email existe déjà avant d'envoyer l'update
      const response = await axiosInstance.get(
        `http://localhost:5000/api/users/email/${userProfile.email}`
      )

      if (response.data) {
        setAlertMessage("Cette adresse e-mail est déjà utilisée")
        setSeverity("error")
        setAlertOpen(true)
        return // Stopper ici si l'email est déjà pris
      }
    }
    console.log("Debug")
    // Si l'email est unique, procéder à la mise à jour
    const result = await dispatch(
      updateUser({
        userId: user._id,
        updatedFields: { [field]: userProfile[field] },
      })
    )

    // if (result.error) {
    //   setAlertMessage(result.error.message || "Une erreur est survenue.")
    //   setSeverity("error")
    //   setAlertOpen(true)
    // } else {
    //   setAlertMessage("Mise à jour réussie !")
    //   setSeverity("success")
    //   setAlertOpen(true)
    //   setEditableField(null) // Fermer l'édition seulement si l'update réussit
    // }
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error)
    setAlertMessage("Erreur de mise à jour.")
    setSeverity("error")
    setAlertOpen(true)
  }
}
