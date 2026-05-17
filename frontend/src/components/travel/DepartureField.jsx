import { useState, useContext } from "react";
import { MapPin } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import MapPickerModal from "./MapPickerModal";

function DepartureField({ value, onChange }) {
  const { user } = useContext(UserContext);
  const [showMap, setShowMap] = useState(false);

  const handleMapConfirm = (fields) => {
    onChange(fields);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Lieu de départ
      </label>

      <button
        onClick={() => setShowMap(true)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 transition"
      >
        <MapPin size={16} className="text-indigo-600 flex-shrink-0" />
        <span className={`text-sm ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || "Choisir sur la carte..."}
        </span>
      </button>

      {showMap && (
        <MapPickerModal
          initialLat={user?.location_latitude}
          initialLng={user?.location_longitude}
          onClose={() => setShowMap(false)}
          onConfirm={handleMapConfirm}
        />
      )}
    </div>
  );
}

export default DepartureField;