import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { API_URLS, normalizeUser } from "../utils";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({
    username: "",
    password: "",
    pseudo: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        // ─── Connexion ────────────────────────────────────────────────
        const res = await fetch(API_URLS.token, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError("Identifiants incorrects");
          return;
        }
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        const meRes = await fetch(API_URLS.me, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        const me = await meRes.json();
        setUser(normalizeUser(me));
        navigate("/");

      } else {
        // ─── Inscription ──────────────────────────────────────────────
        if (!form.username || !form.pseudo || !form.password) {
          setError("Username, pseudo et mot de passe sont obligatoires");
          return;
        }
        const res = await fetch(`${API_URLS.users}register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            pseudo: form.pseudo,
            email: form.email,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail ?? "Une erreur est survenue");
          return;
        }
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        const meRes = await fetch(API_URLS.me, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        const me = await meRes.json();
        setUser(normalizeUser(me));
        navigate("/");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CubVoit</h1>
        </div>

        {/* Toggle login / register */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white mb-6">
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 py-2.5 text-sm transition ${
              isLogin ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            Connexion
          </button>
          <div className="w-px bg-gray-200" />
          <button
            onClick={() => { setMode("register"); setError(null); }}
            className={`flex-1 py-2.5 text-sm transition ${
              !isLogin ? "bg-indigo-600 text-white" : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Identifiant</label>
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="identifiant de connexion"
              autoCapitalize="none"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Pseudo</label>
              <input
                value={form.pseudo}
                onChange={(e) => handleChange("pseudo", e.target.value)}
                placeholder="pseudo affiché"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Email <span className="text-gray-300">(optionnel)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="abc@email.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </div>
      </div>
    </div>
  );
}