import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function DepartureField({ value, onChange }) {
  const { user } = useContext(UserContext);

  const resetToHome = () => {
    onChange({
      start_location_name: user.location_name,
      start_latitude: user.location_latitude,
      start_longitude: user.location_longitude,
    });
  };

  const showHomeButton = user?.location_name && value !== user.location_name;

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Lieu de départ
      </label>
      <input
        value={value}
        onChange={(e) => onChange({ start_location_name: e.target.value })}
        placeholder="Ville de départ"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
      />
      {showHomeButton && (
        <button
          onClick={resetToHome}
          className="text-xs text-indigo-500 mt-1"
        >
          Utiliser mon domicile ({user.location_name})
        </button>
      )}
    </div>
  );
}

export default DepartureField;