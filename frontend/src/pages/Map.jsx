import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search, X } from "lucide-react";
import { UserContext } from "../context/UserContext";
import TravelRoute from "../components/travel/TravelRoute";
import TravelPopup from "../components/travel/TravelPopup";
import { API_URLS } from "../utils";

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
  const [filter, setFilter] = useState("all");
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

      {/* Carte */}
      <MapContainer
        className="h-full w-full"
        center={[46.5, 2.5]}
        zoom={6}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
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
      <div className="absolute top-4 left-4 z-[500] bg-bg-surface rounded-lg shadow-sm border border-border px-3 py-2.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full" style={{ background: 'var(--route-mine)' }} />
          <span className="text-xs text-text-muted">Mes trajets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 rounded-full" style={{ background: "var(--route-other)" }} />
          <span className="text-xs text-text-muted">Disponibles</span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col items-end gap-2">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 rounded-full bg-bg-surface border border-border shadow-sm flex items-center justify-center hover:bg-bg-raised transition"
        >
          {searchOpen
            ? <X size={16} className="text-text-muted" />
            : <Search size={16} className="text-text-muted" />
          }
        </button>

        {searchOpen && (
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un trajet..."
            className="w-48 px-3 py-2 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary shadow-sm"
          />
        )}

        <div className="flex flex-col gap-1.5">
          {[
            { key: "all",    label: "Tous" },
            { key: "mine",   label: "Mes trajets" },
            { key: "others", label: "Proposés" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs border shadow-sm transition ${
                filter === key
                  ? "bg-primary text-primary-text border-primary"
                  : "bg-bg-surface text-text-muted border-border hover:border-border-strong"
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