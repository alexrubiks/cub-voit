import { useState, useContext } from "react";
import { MapPin } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import MapPickerModal from "./MapPickerModal";

function DepartureField({ value, onChange }) {
  const { user } = useContext(UserContext);
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
        Lieu de départ
      </label>
      <button
        onClick={() => setShowMap(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-bg-surface border border-border rounded-lg hover:border-primary transition"
      >
        <MapPin size={16} className="text-primary flex-shrink-0" />
        <span className={`text-sm ${value ? "text-text-primary" : "text-text-muted"}`}>
          {value || "Choisir sur la carte..."}
        </span>
      </button>
      {showMap && (
        <MapPickerModal
          initialLat={user?.location_latitude}
          initialLng={user?.location_longitude}
          onClose={() => setShowMap(false)}
          onConfirm={onChange}
        />
      )}
    </div>
  );
}

export default DepartureField;