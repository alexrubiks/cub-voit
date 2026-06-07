import { useState, useEffect, useContext } from "react";
import { Search, X, Plus } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import PassengerRow from "./PassengerRow";
import Avatar from "../ui/Avatar";
import { API_URLS } from "../../utils";

function PassengerSearch({ vehicle, passengers, onAdd, onRemove }) {
  const { user }    = useContext(UserContext);
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [focused, setFocused]   = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const maxPassengers    = vehicle.seats - 1;
  const validPassengers  = passengers.slice(0, maxPassengers);
  const excessPassengers = passengers.slice(maxPassengers);
  const isFull           = passengers.length >= maxPassengers;

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        const res = await fetch(`${API_URLS.users}?search=${query}`, {
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
      <div className="bg-bg-surface border border-border rounded-lg px-4 py-3 space-y-1">

        {/* Conducteur */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-text-muted w-20 flex-shrink-0">Conducteur</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <PassengerRow user={user} />

        {/* Séparateur passagers */}
        {(passengers.length > 0 || !isFull) && (
          <div className="flex items-center gap-2 pt-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-text-muted w-20 flex-shrink-0">
              Passagers {passengers.length}/{maxPassengers}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        )}

        {/* Liste passagers */}
        {validPassengers.map((p) => (
          <PassengerRow key={p.id} user={p} onRemove={onRemove} />
        ))}
        {excessPassengers.map((p) => (
          <div key={p.id} className="bg-danger-bg rounded-lg px-2">
            <PassengerRow user={p} onRemove={onRemove} />
          </div>
        ))}

        {/* Bouton ajouter */}
        {!isFull && !showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-lg text-text-muted hover:border-primary hover:text-primary transition"
          >
            <Plus size={16} />
            <span className="text-sm">Ajouter un passager</span>
          </button>
        )}

        {/* Recherche inline */}
        {showSearch && (
          <div className="relative mt-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setFocused(true); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => { setFocused(false); setShowSearch(false); setQuery(""); }, 150)}
              placeholder="Pseudo ou WCA ID..."
              className="w-full pl-9 pr-9 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            <button
              onMouseDown={() => { setShowSearch(false); setQuery(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-text-muted" />
            </button>

            {focused && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded-lg shadow-md z-10 overflow-hidden">
                {results.map((u) => (
                  <div
                    key={u.id}
                    onMouseDown={() => handleAdd(u)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-bg-raised cursor-pointer border-b border-border last:border-none"
                  >
                    <Avatar user={u} />
                    <div>
                      <p className="text-sm text-text-primary">{u.pseudo}</p>
                      {u.wca_id && <p className="text-xs text-text-muted">{u.wca_id}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {focused && query.length >= 2 && results.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded-lg shadow-md z-10 px-4 py-3">
                <p className="text-sm text-text-muted">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        )}

        {/* Véhicule plein */}
        {isFull && (
          <p className="text-xs text-center text-text-muted pt-2">
            Véhicule complet · {vehicle.seats} places
          </p>
        )}
      </div>
    </div>
  );
}

export default PassengerSearch;