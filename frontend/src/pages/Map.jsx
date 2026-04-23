import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { travels } from "../data/travels";
import TravelRoute from "../components/TravelRoute";

function Map() {
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
        />

        {/* 🔥 boucle propre */}
        {travels.map((travel) => (
          <TravelRoute
            key={travel.id}
            travel={travel}
          />
        ))}

      </MapContainer>

    </div>
  );
}

export default Map;