import { useState, useEffect } from "react";
import { Car, ChevronDown, Plus } from "lucide-react";
import VehicleModal from "./VehicleModal";

function VehicleSelect({ value, onChange }) {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/vehicles/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setVehicles);
  }, []);

  const handleVehicleCreated = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
    onChange(vehicle.id);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Véhicule
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 ${
              value ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <option value="" disabled hidden>Sélectionner...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} · {v.seats} places
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition flex-shrink-0"
        >
          <Plus size={18} className="text-indigo-600" />
        </button>
      </div>

      {showModal && (
        <VehicleModal
          onClose={() => setShowModal(false)}
          onCreated={handleVehicleCreated}
        />
      )}
    </div>
  );
}

export default VehicleSelect;