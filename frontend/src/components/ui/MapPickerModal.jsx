import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { X, Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapClickHandler({ onMove }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapPickerModal({ initialLat, initialLng, onClose, onConfirm }) {
  const defaultLat = initialLat || 46.603354;
  const defaultLng = initialLng || 1.888334;

  const [markerPos, setMarkerPos] = useState({ lat: defaultLat, lng: defaultLng });
  const [locationName, setLocationName] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${markerPos.lat}&lon=${markerPos.lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data = await res.json();
      if (data.address) {
        const { village, town, city, municipality } = data.address;
        const place = city || town || village || municipality || "";
        setLocationName([place].filter(Boolean).join(", "));
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [markerPos]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 3) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "fr" } }
        );
        const data = await res.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSearchSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setMarkerPos({ lat, lng });
    const { village, town, city, municipality } = place.address;
    const name = city || town || village || municipality || place.display_name.split(",")[0];
    setQuery(name);
    setSearchResults([]);
    setSearchFocused(false);
    if (mapRef.current) mapRef.current.setView([lat, lng], 13);
  };

  const handleConfirm = () => {
    onConfirm({
      start_location_name: locationName,
      start_latitude: markerPos.lat,
      start_longitude: markerPos.lng,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-bg-surface w-full max-w-lg rounded-t-xl overflow-hidden flex flex-col" style={{ height: "70vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <h2 className="text-base font-medium text-text-primary">Choisir le lieu de départ</h2>
          <button onClick={onClose} className="hover:text-text-primary transition">
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Recherche */}
        <div className="px-4 pb-3 flex-shrink-0 relative z-[1000]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchFocused(true); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Rechercher un lieu..."
              className="w-full pl-9 pr-3 py-2.5 bg-bg-base border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded-lg shadow-md overflow-hidden z-[1000]">
                {searchResults.map((place) => {
                  const { village, town, city, municipality, county, state } = place.address;
                  const main = city || town || village || municipality || place.display_name.split(",")[0];
                  const sub = [county, state].filter(Boolean).join(", ");
                  return (
                    <div
                      key={place.place_id}
                      onMouseDown={() => handleSearchSelect(place)}
                      className="px-4 py-3 hover:bg-bg-raised cursor-pointer border-b border-border last:border-none"
                    >
                      <p className="text-sm text-text-primary">{main}</p>
                      <p className="text-xs text-text-muted">{sub}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Carte */}
        <div className="flex-1 min-h-0">
          <MapContainer
            center={[defaultLat, defaultLng]}
            zoom={initialLat ? 13 : 6}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <MapClickHandler onMove={(lat, lng) => setMarkerPos({ lat, lng })} />
            <Marker
              position={[markerPos.lat, markerPos.lng]}
              draggable
              eventHandlers={{
                dragend(e) {
                  const { lat, lng } = e.target.getLatLng();
                  setMarkerPos({ lat, lng });
                },
              }}
            />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-bg-surface border-t border-border flex-shrink-0">
          {locationName && (
            <p className="text-xs text-text-muted mb-2 truncate">{locationName}</p>
          )}
          <button
            onClick={handleConfirm}
            className="w-full bg-primary text-primary-text rounded-lg py-3 text-sm font-medium hover:bg-primary-hover transition"
          >
            Confirmer ce lieu
          </button>
        </div>

      </div>
    </div>
  );
}

export default MapPickerModal;