import { useState, useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useTheme } from "../hooks/useTheme";
import { API_URLS, normalizeUser } from "../utils";

export default function Login() {
  const { dark, setDark } = useTheme();
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
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6">
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center z-[9999] hover:bg-bg-raised transition"
      >
        {dark ? <Moon size={16} className="text-text-muted" /> : <Sun size={16} className="text-primary" />}
      </button>

      <div className="w-full max-w-sm">

        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary">
            CubVoit
          </h1>
          <p className="text-text-muted text-lg">
            L'appli de covoiturage pour les compétitions
          </p>
        </div>


        {/* Toggle login / register */}
        <div className="flex rounded-lg overflow-hidden border border-border bg-bg-surface mb-6">
          <button
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-sm transition ${
              isLogin
                ? "bg-primary text-primary-text"
                : "text-text-muted hover:bg-bg-raised"
            }`}
          >
            Connexion
          </button>

          <div className="w-px bg-border" />

          <button
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 py-2.5 text-sm transition ${
              !isLogin
                ? "bg-primary text-primary-text"
                : "text-text-muted hover:bg-bg-raised"
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-bg-surface rounded-lg border border-border p-5 space-y-4">

          <div>
            <label className="text-xs text-text-muted mb-1 block">
              Identifiant
            </label>
            <input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="identifiant de connexion"
              autoCapitalize="none"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Pseudo
              </label>
              <input
                value={form.pseudo}
                onChange={(e) => handleChange("pseudo", e.target.value)}
                placeholder="pseudo affiché"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Email{" "}
                <span className="text-text-disabled">(optionnel)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="abc@email.com"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-text-muted mb-1 block">
              Mot de passe
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
            />
          </div>

          {error && (
            <p className="text-xs text-danger-text">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-primary-text rounded-lg py-3 text-sm font-medium hover:bg-primary-hover transition disabled:opacity-50"
          >
            {loading
              ? "..."
              : isLogin
              ? "Se connecter"
              : "Créer mon compte"}
          </button>
        </div>
      </div>
    </div>
  );
}