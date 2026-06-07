import { useState, useEffect } from "react";
import { Car, ChevronDown, Plus } from "lucide-react";
import VehicleModal from "./VehicleModal";
import { API_URLS } from "../../utils";

function VehicleSelect({ value, onChange }) {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(API_URLS.vehicles, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setVehicles);
  }, []);

  const handleVehicleCreated = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
    onChange(vehicle);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
        Véhicule
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <select
            value={value}
            onChange={(e) => {
              const vehicle = vehicles.find((v) => v.id === parseInt(e.target.value));
              onChange(vehicle);
            }}
            className={`w-full appearance-none pl-9 pr-8 py-2.5 bg-bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary ${
              value ? "text-text-primary" : "text-text-muted"
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
          className="w-10 h-10 rounded-lg bg-primary-subtle flex items-center justify-center hover:bg-primary hover:text-primary-text transition flex-shrink-0"
        >
          <Plus size={18} className="text-primary" />
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