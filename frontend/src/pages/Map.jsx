import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X } from "lucide-react";
import { UserContext } from "../context/UserContext";
import TravelRoute from "../components/travel/TravelRoute";
import TravelPopup from "../components/travel/TravelPopup";
import { API_URLS } from "../utils";

// Fix icône Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Map() {
  const { user } = useContext(UserContext);
  const [travels, setTravels] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "mine" | "others"
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    fetch(API_URLS.travels, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setTravels(data.filter((t) => {
        if (!t.date) return true;
        return new Date(t.date + "T00:00:00Z") >= new Date();
      })))
      .catch(console.error);
  }, []);

  const filteredTravels = travels
    .filter((t) => {
      if (search.length >= 2) {
        return t.name?.toLowerCase().includes(search.toLowerCase()) ||
              t.competition?.name?.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    })
    .filter((t) => {
      const isMine = t.owner?.id === user?.id || t.passengers?.some((p) => p.id === user?.id);
      if (filter === "mine") return isMine;
      if (filter === "others") return !isMine;
      return true;
    });

  return (
    <div className="fixed inset-0">
      <MapContainer
        className="h-full w-full"
        center={[46.5, 2.5]}
        zoom={6}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {filteredTravels.map((travel) => (
          <TravelRoute
            key={travel.id}
            travel={travel}
            currentUserId={user?.id}
            onClick={setSelectedTravel}
          />
        ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute top-4 left-4 z-[500] bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full bg-indigo-500" />
          <span className="text-xs text-gray-500">Mes trajets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">Disponibles</span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col items-end gap-2">
        
        {/* Bouton recherche */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center"
        >
          {searchOpen ? <X size={16} className="text-gray-500" /> : <Search size={16} className="text-gray-500" />}
        </button>

        {/* Barre de recherche */}
        {searchOpen && (
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un trajet..."
            className="w-48 px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none shadow-sm"
          />
        )}

        {/* Filtres */}
        <div className="flex flex-col gap-1.5">
          {[
            { key: "all", label: "Tous" },
            { key: "mine", label: "Mes trajets" },
            { key: "others", label: "Proposés" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs border shadow-sm transition ${
                filter === key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-500 border-gray-100 hover:border-indigo-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Popup trajet */}
      <TravelPopup
        travel={selectedTravel}
        currentUserId={user?.id}
        onClose={() => setSelectedTravel(null)}
      />
    </div>
  );
}

export default Map;