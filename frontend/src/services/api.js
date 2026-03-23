const API_URL = "http://127.0.0.1:8000/api";

export async function getTravels() {
  const res = await fetch(`${API_URL}/travels/`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erreur API");
  }

  return res.json();
}