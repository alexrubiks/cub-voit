import { useState, useEffect, useContext } from "react";
import { Search, X, Plus } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import PassengerRow from "./PassengerRow";
import Avatar from "./Avatar";

function PassengerSearch({ vehicle, passengers, onAdd, onRemove }) {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const maxPassengers = vehicle.seats - 1; // -1 pour le conducteur
  const isFull = passengers.length >= maxPassengers;

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        const res = await fetch(`http://localhost:8000/api/users/?search=${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        const filtered = (data.results ?? data).filter(
          (u) => u.id !== user.id && !passengers.find((p) => p.id === u.id)
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, passengers]);

  const handleAdd = (u) => {
    onAdd(u);
    setQuery("");
    setResults([]);
    setFocused(false);
    setShowSearch(false);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Passagers
      </label>

      {/* Carte visuelle */}
      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 space-y-1">

        {/* Conducteur */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-gray-300 w-20 flex-shrink-0">Conducteur</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>
        <PassengerRow user={user} />

        {/* Séparateur */}
        {(passengers.length > 0 || !isFull) && (
          <div className="flex items-center gap-2 pt-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-300 w-20 flex-shrink-0">
              Passagers {passengers.length}/{maxPassengers}
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
        )}

        {/* Liste des passagers */}
        {passengers.map((p) => (
          <PassengerRow key={p.id} user={p} onRemove={onRemove} />
        ))}

        {/* Bouton ajouter */}
        {!isFull && !showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-indigo-300 hover:text-indigo-400 transition"
          >
            <Plus size={16} />
            <span className="text-sm">Ajouter un passager</span>
          </button>
        )}

        {/* Champ de recherche inline */}
        {showSearch && (
          <div className="relative mt-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => { setFocused(false); setShowSearch(false); setQuery(""); }, 150)}
              placeholder="Pseudo ou WCA ID..."
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-300"
            />
            <button
              onMouseDown={() => { setShowSearch(false); setQuery(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-gray-300" />
            </button>

            {focused && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 overflow-hidden">
                {results.map((u) => (
                  <div
                    key={u.id}
                    onMouseDown={() => handleAdd(u)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    <Avatar user={u} />
                    <div>
                      <p className="text-sm text-gray-900">{u.pseudo}</p>
                      {u.wca_id && <p className="text-xs text-gray-400">{u.wca_id}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {focused && query.length >= 2 && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 px-4 py-3">
                <p className="text-sm text-gray-400">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* Véhicule plein */}
        {isFull && (
          <p className="text-xs text-center text-gray-400 pt-2">
            Véhicule complet · {vehicle.seats} places
          </p>
        )}
      </div>
    </div>
  );
}

export default PassengerSearch;