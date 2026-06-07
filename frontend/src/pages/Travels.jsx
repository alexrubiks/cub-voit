import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TravelList from "../components/travel/TravelList";
import { API_URLS } from "../utils";
import { useSearchParams } from "react-router-dom";

function Travels() {
  const navigate = useNavigate();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState("all");
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [searchOpen, setSearchOpen] = useState(!!searchParams.get("search"));

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch(API_URLS.travels, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTravels(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTravels();
  }, []);

  const now = new Date();

  const filtered = search.length === 0
    ? travels
    : travels.filter((t) => t.competition.name.toLowerCase().includes(search.toLowerCase()));

  const filterByRole = (list) => {
    if (filter === "mine") return list.filter(
      (t) => t.owner.id === user.id || t.passengers.some((p) => p.id === user.id)
    );
    if (filter === "others") return list.filter(
      (t) => t.owner.id !== user.id && !t.passengers.some((p) => p.id === user.id)
    );
    return list;
  };

  const upcoming = filterByRole(filtered).filter((t) => !t.date || new Date(t.date) >= now);

  const past = filterByRole(filtered).filter((t) => {
    if (!t.date || new Date(t.date + "T00:00:00Z") >= now) return false;
    return t.owner.id === user.id || t.passengers.some((p) => p.id === user.id);
  });

  const handleUpdated = (updatedTravel) => {
    setTravels((prev) =>
      prev.map((t) => t.id === updatedTravel.id ? updatedTravel : t)
    );
  };

  const handleDeleted = (id) => {
    setTravels((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl text-text-primary font-bold">Mes trajets</h1>
        <div className="flex gap-2 items-center">
          {/* Bouton search */}
          <button
            onClick={() => { setSearchOpen(!searchOpen); setSearch(""); }}
            className="w-10 h-10 rounded-full bg-bg-raised border border-border flex items-center justify-center shadow-sm hover:bg-bg-raised transition"
          >
            {searchOpen
              ? <X size={18} className="text-text-muted" />
              : <Search size={18} className="text-text-muted" />}
          </button>

          {/* Bouton créer */}
          <button
            onClick={() => navigate("/create")}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm hover:bg-primary-hover transition"
          >
            <Plus size={18} className="text-primary-text" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
      {/* Filtres */}
      {[
        { key: "all",    label: "Tous" },
        { key: "mine",   label: "Mes trajets" },
        { key: "others", label: "Proposés" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            filter === key
              ? "bg-primary text-primary-text border-primary"
              : "bg-bg-surface text-text-muted border-border hover:border-border-strong"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

      {/* Barre de recherche */}
      <div className={`overflow-hidden transition-all duration-200 ${searchOpen ? "max-h-16 mb-4" : "max-h-0"}`}>
        <input
          type="text"
          placeholder="Rechercher un trajet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary shadow-sm"
          autoFocus={searchOpen}
        />
      </div>

      {/* Contenu */}
      {loading ? (
        <p className="text-center text-text-muted mt-10">Chargement...</p>
      ) : travels.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-3">
          <p className="text-text-muted text-base">Aucun trajet pour l'instant</p>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-text rounded-lg text-sm hover:bg-primary-hover transition"
          >
            <Plus size={16} /> Créer un trajet
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-text-muted italic mt-10">Aucun trajet trouvé</p>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2 px-1">À venir</p>
              <TravelList
                travels={upcoming}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2 px-1">Passés</p>
              <TravelList travels={past} past />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Travels;