import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
        {travels.map((travel) => (
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