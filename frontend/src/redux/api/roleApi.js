import axiosInstance from "../../axiosConfig"

// Récupérer tous les rôles
export const getRoles = async () => {
  const response = await axiosInstance.get(
    "https://intranet.logistock/api/roles/"
  )
  return response.data
}

// Récupérer un rôle par ID
export const getRoleById = async (roleId) => {
  const response = await axiosInstance.get(
    `https://intranet.logistock/api/roles/${roleId}`
  )
  return response.data
}

// Ajouter un nouveau rôle
export const addRole = async (roleData) => {
  const response = await axiosInstance.post(
    "https://intranet.logistock/api/roles",
    roleData
  )
  return response.data
}

// Mettre à jour un rôle par ID
export const updateRoleById = async (roleId, roleUpdates) => {
  const response = await axiosInstance.put(
    `https://intranet.logistock/api/roles/${roleId}`,
    roleUpdates
  )
  return response.data
}

// Supprimer un rôle par ID
export const deleteRoleById = async (roleId) => {
  const response = await axiosInstance.delete(
    `https://intranet.logistock/api/roles/${roleId}`
  )
  return response.data
}
