import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const res = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });

    if (res.ok) {
      const { access, refresh } = await res.json();
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      const meRes = await fetch("http://localhost:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const data = await meRes.json();
      setUser(data);
      navigate("/");
    } else {
      setError("Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-100 p-6">
        <h1 className="text-lg font-medium text-gray-900 mb-1">Connexion</h1>
        <p className="text-sm text-gray-400 mb-6">Bienvenue, connecte-toi pour continuer</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Nom d'utilisateur</label>
            <input name="username" type="text" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">Mot de passe</label>
            <input name="password" type="password" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-400" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit" className="bg-emerald-600 text-white rounded-lg py-2.5 text-sm font-medium mt-1 hover:bg-emerald-700 transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}