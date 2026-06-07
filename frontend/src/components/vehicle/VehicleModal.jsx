import { useState } from "react";
import { X } from "lucide-react";
import { API_URLS } from "../../utils";

function VehicleModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(2);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !seats) { setError("Tous les champs sont requis"); return; }
    const res = await fetch(API_URLS.vehicles, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, seats: parseInt(seats) }),
    });
    if (res.ok) {
      const data = await res.json();
      onCreated(data);
      onClose();
    } else {
      setError("Erreur lors de la création");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-bg-surface w-full max-w-lg rounded-t-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-text-primary">Nouveau véhicule</h2>
          <button onClick={onClose} className="hover:text-text-primary transition">
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1 block">Nom du véhicule</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Peugeot 308"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Places</label>
              <div className="flex items-center border border-border rounded-lg overflow-hidden bg-bg-surface">
                <button
                  onClick={() => setSeats(Math.max(1, parseInt(seats || 1) - 1))}
                  className="px-3 py-2.5 text-text-muted hover:bg-bg-raised transition"
                >−</button>
                <span className="w-6 text-center text-sm text-text-primary">{seats}</span>
                <button
                  onClick={() => setSeats(parseInt(seats || 0) + 1)}
                  className="px-3 py-2.5 text-text-muted hover:bg-bg-raised transition"
                >+</button>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-danger-text">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-text rounded-lg py-3 text-sm font-medium hover:bg-primary-hover transition"
        >
          Créer le véhicule
        </button>
      </div>
    </div>
  );
}

export default VehicleModal;