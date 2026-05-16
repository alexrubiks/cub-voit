import { useState, useEffect } from "react";
import { Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TravelList from "../components/TravelList";

function Travels() {
  const navigate = useNavigate();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/travels/", {
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
    : travels.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const upcoming = filtered.filter((t) => !t.date || new Date(t.date) >= now);
  const past = filtered.filter((t) => t.date && new Date(t.date) < now);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl text-gray-900 font-bold">Mes trajets</h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => { setSearchOpen(!searchOpen); setSearch(""); }}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
          >
            {searchOpen ? <X size={18} className="text-gray-600" /> : <Search size={18} className="text-gray-600" />}
          </button>
          <button
            onClick={() => navigate("/create")}
            className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className={`overflow-hidden transition-all duration-200 ${searchOpen ? "max-h-16 mb-4" : "max-h-0"}`}>
        <input
          type="text"
          placeholder="Rechercher un trajet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-indigo-300 shadow-sm"
          autoFocus={searchOpen}
        />
      </div>

      {/* Contenu */}
      {loading ? (
        <p className="text-center text-gray-400 mt-10">Chargement...</p>
      ) : travels.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-3">
          <p className="text-gray-400 text-base">Aucun trajet pour l'instant</p>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            <Plus size={16} /> Créer un trajet
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-10">Aucun trajet trouvé</p>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 px-1">À venir</p>
              <TravelList travels={upcoming} />
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 px-1">Passés</p>
              <TravelList travels={past} past />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Travels;