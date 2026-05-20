const API_BASE = "http://localhost:8000";

export const API_URLS = {
  token: `${API_BASE}/api/token/`,
  tokenRefresh: `${API_BASE}/api/token/refresh/`,
  me: `${API_BASE}/api/users/me/`,
  updateMe: `${API_BASE}/api/users/update_me/`,
  changePassword: `${API_BASE}/api/users/change_password/`,
  logoutAll: `${API_BASE}/api/users/logout_all/`,
  deleteAccount: `${API_BASE}/api/users/delete_account/`,
  uploadAvatar: `${API_BASE}/api/upload-avatar/`,
  users: `${API_BASE}/api/users/`,
  travels: `${API_BASE}/api/travels/`,
  vehicles: `${API_BASE}/api/vehicles/`,
  competitions: `${API_BASE}/api/competitions-search/`,
};

export async function getTravels() {
  const res = await fetch(API_URLS.travels, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
}

/**
 * Normalise les données utilisateur reçues de l'API.
 * S'assure que l'URL de l'avatar est toujours absolue.
 */
export const normalizeUser = (data) => ({
  ...data,
  avatar: data.avatar
    ? data.avatar.startsWith("http")
      ? data.avatar
      : `${API_BASE}${data.avatar}`
    : null,
});