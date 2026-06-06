import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, X, Users } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import { API_URLS } from "../../utils";
import ConfirmModal from "../../components/ui/ConfirmModal";

// ─── Carte membre du cercle ──────────────────────────────────────────────────
function WhitelistCard({ user, onRemove }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {user.avatar
          ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
          : <span className="text-sm text-indigo-500 font-medium">{user.pseudo?.[0]}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{user.pseudo}</p>
        {user.wca_id && <p className="text-xs text-gray-400">{user.wca_id}</p>}
      </div>
      <button
        onClick={() => onRemove(user)}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition flex-shrink-0"
      >
        <X size={15} className="text-gray-300 hover:text-red-400 transition" />
      </button>
    </div>
  );
}

// ─── Page principale ────────────────────────────────────────────────────────
export default function AccountWhitelist() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [searching, setSearching] = useState(false);

  const [toRemove, setToRemove] = useState(null);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ─── Chargement whitelist ─────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URLS.users}list_whitelist/`, { headers: authHeader })
      .then((res) => res.json())
      .then((data) => { setWhitelist(data.results ?? data); setLoading(false); })
      .then((data) => {
        const sorted = (data.results ?? data).sort((a, b) => 
            a.pseudo.localeCompare(b.pseudo)
        );
        setWhitelist(sorted);
        setLoading(false);
        });
  }, []);

  // ─── Recherche utilisateurs ───────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        setSearching(true);
        const res = await fetch(`${API_URLS.users}?search=${query}`, { headers: authHeader });
        const data = await res.json();
        const filtered = (data.results ?? data).filter(
          (u) => u.id !== user.id && !whitelist.find((w) => w.id === u.id)
        );
        setResults(filtered);
        setSearching(false);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, whitelist]);

  // ─── Ajouter ─────────────────────────────────────────────────────────
  const handleAdd = async (u) => {
    await fetch(`${API_URLS.users}${u.id}/add_to_whitelist/`, {
      method: "POST",
      headers: authHeader,
    });
    setWhitelist((prev) => [...prev, u].sort((a, b) => a.pseudo.localeCompare(b.pseudo)));
    setQuery("");
    setResults([]);
    setFocused(false);
  };

  // ─── Retirer ─────────────────────────────────────────────────────────
  const handleRemove = async () => {
    await fetch(`${API_URLS.users}${toRemove.id}/remove_from_whitelist/`, {
      method: "POST",
      headers: authHeader,
    });
    setWhitelist((prev) => prev.filter((u) => u.id !== toRemove.id));
    setToRemove(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate("/account")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-lg font-medium text-gray-900">Cercle privé</h1>
          <p className="text-xs text-gray-400">
            {whitelist.length} {whitelist.length === 1 ? "personne" : "personnes"}
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-8">

        {/* Explication */}
        <div className="bg-indigo-50 rounded-xl px-4 py-3">
          <p className="text-xs text-indigo-600 leading-relaxed">
            Les personnes de ton cercle pourront voir tes trajets privés même si tu ne les as pas ajoutées comme passagers.
          </p>
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Ajouter par pseudo ou WCA ID..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-300"
          />
          {focused && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 overflow-hidden">
              {results.map((u) => (
                <div
                  key={u.id}
                  onMouseDown={() => handleAdd(u)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {u.avatar
                      ? <img src={u.avatar} className="w-full h-full object-cover" alt="" />
                      : <span className="text-xs text-indigo-500">{u.pseudo?.[0]}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{u.pseudo}</p>
                    {u.wca_id && <p className="text-xs text-gray-400">{u.wca_id}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {focused && query.length >= 2 && !searching && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 px-4 py-3">
              <p className="text-sm text-gray-400">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Liste */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm mt-8">Chargement...</p>
        ) : whitelist.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Users size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">Ton cercle privé est vide</p>
            <p className="text-xs text-gray-300">Recherche des amis pour les ajouter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {whitelist.map((u) => (
              <WhitelistCard key={u.id} user={u} onRemove={setToRemove} />
            ))}
          </div>
        )}
      </div>

      {/* Modale de confirmation */}
      {toRemove && (
        <ConfirmModal
          title={`Retirer ${toRemove.pseudo} ?`}
          description="Cette personne ne pourra plus voir tes trajets privés."
          confirmLabel="Retirer"
          onConfirm={handleRemove}
          onClose={() => setToRemove(null)}
        />
      )}
    </div>
  );
}