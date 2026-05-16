import { useState, useEffect, useContext } from "react";
import { Search, Plus, X, Car, ChevronDown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// ─── Modale création véhicule ───────────────────────────────────────────────
function VehicleModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(2);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name || !seats) { setError("Tous les champs sont requis"); return; }
    const res = await fetch("http://localhost:8000/api/vehicles/", {
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
      <div className="bg-gray-50 w-full max-w-lg rounded-t-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900">Nouveau véhicule</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Nom du véhicule</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Peugeot 308"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Places</label>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setSeats(Math.max(1, parseInt(seats || 1) - 1))}
                  className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition"
                >−</button>
                <span className="w-6 text-center text-sm text-gray-900">{seats}</span>
                <button
                  onClick={() => setSeats(parseInt(seats || 0) + 1)}
                  className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition"
                >+</button>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition"
        >
          Créer le véhicule
        </button>
      </div>
    </div>
  );
}

// ─── Page principale ────────────────────────────────────────────────────────
function CreateTravel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    date: "",
    start_location_name: user?.location_name ?? "",
    start_latitude: user?.location_latitude ?? "",
    start_longitude: user?.location_longitude ?? "",
    end_location_name: "",
    end_latitude: "",
    end_longitude: "",
    competition_id: "",
    vehicle_id: "",
  });

  const [dateMode, setDateMode] = useState(null); // "same" | "before" | "custom"
  const [competitionQuery, setCompetitionQuery] = useState("");
  const [competitionResults, setCompetitionResults] = useState([]);
  const [competitionFocused, setCompetitionFocused] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Chargement des véhicules
  useEffect(() => {
    fetch("http://localhost:8000/api/vehicles/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setVehicles);
  }, []);

  // Autocomplete compétitions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (competitionQuery.length >= 2) {
        fetch(`http://localhost:8000/api/competitions-search/?q=${competitionQuery}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => res.json())
          .then(setCompetitionResults);
      } else {
        setCompetitionResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [competitionQuery]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectCompetition = (c) => {
    setSelectedCompetition(c);
    setCompetitionQuery(c.name);
    setCompetitionFocused(false);
    setCompetitionResults([]);
    handleChange("competition_id", c.id);
    handleChange("end_location_name", c.location);
    handleChange("end_latitude", c.latitude);
    handleChange("end_longitude", c.longitude);

    // Calcul de la date selon le mode sélectionné
    if (dateMode === "same") {
      handleChange("date", c.date);
    } else if (dateMode === "before") {
      const d = new Date(c.date + "T00:00:00Z");
      d.setUTCDate(d.getDate() - 1);
      handleChange("date", d.toISOString().split("T")[0]);
    }
  };

  const handleDateMode = (mode) => {
    setDateMode(mode);
    if (!selectedCompetition) return;
    if (mode === "same") {
      handleChange("date", selectedCompetition.date);
    } else if (mode === "before") {
      const d = new Date(selectedCompetition.date + "T00:00:00Z");
      d.setUTCDate(d.getDate() - 1);
      handleChange("date", d.toISOString().split("T")[0]);
    } else {
      handleChange("date", "");
    }
  };

  const handleVehicleCreated = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
    handleChange("vehicle_id", vehicle.id);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.competition_id) { setError("Sélectionne une compétition"); return; }
    if (!form.date) { setError("Choisis une date"); return; }
    if (!form.vehicle_id) { setError("Sélectionne un véhicule"); return; }
    if (!form.start_location_name) { setError("Indique un lieu de départ"); return; }

    setSubmitting(true);
    const res = await fetch("http://localhost:8000/api/travels/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    setSubmitting(false);
    if (res.ok) {
      navigate("/travels");
    } else {
      const data = await res.json();
      setError(JSON.stringify(data));
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8">
      <h1 className="text-3xl text-gray-900 font-bold">Créer un trajet</h1>

      {/* ── Compétition ── */}
      <div>
        <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Compétition</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            value={competitionQuery}
            onChange={(e) => { setCompetitionQuery(e.target.value); setSelectedCompetition(null); }}
            onFocus={() => setCompetitionFocused(true)}
            onBlur={() => setTimeout(() => setCompetitionFocused(false), 150)}
            placeholder="Rechercher une compétition..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-300"
          />
          {competitionFocused && competitionResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 overflow-hidden">
              
              {competitionResults.map((c) => (
                <div
                  key={c.id}
                  onMouseDown={() => selectCompetition(c)}
                  className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none"
                >
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Date ── */}
      <div>
        <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Date de départ</label>
        <div className="flex gap-2 mb-2">
          {[
            { key: "same", label: "Jour J", date: selectedCompetition?.date },
            { key: "before", label: "Veille", date: selectedCompetition ? (() => { const d = new Date(selectedCompetition.date + "T00:00:00Z"); d.setUTCDate(d.getDate() - 1); return d.toISOString().split("T")[0]; })() : null },
            { key: "custom", label: "custom" },
          ].map(({ key, label, date }) => {
            const active = dateMode === key;
            const day = date ? new Date(date + "T00:00:00Z").getDate() : null;
            const month = date ? new Date(date + "T00:00:00Z").toLocaleString("fr-FR", { month: "short" }) : null;

            return (
              <button
                key={key}
                onClick={() => handleDateMode(key)}
                className={`flex-1 aspect-square flex flex-col items-center justify-center rounded-xl border transition ${
                  active ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300 hover:border-indigo-300"
                }`}
              >
                {key === "custom" ? (
                  <>
                    <Calendar size={26} className={active ? "text-white" : "text-gray-400"} />
                    <span className={`text-sm mt-1 ${active ? "text-white" : "text-gray-400"}`}>Choisir</span>
                  </>
                ) : day ? (
                  <>
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                      <span className={`absolute top-2 text-[12px] uppercase tracking-widest mb-1 ${active ? "text-white/60" : "text-gray-500"}`}>
                        {label}
                      </span>
                      <span className={`text-4xl font-bold leading-none ${active ? "text-white" : "text-indigo-600"}`}>{day}</span>
                      <span className={`text-base mt-0.5 lowercase ${active ? "text-white/80" : "text-indigo-600"}`}>{month}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className={`text-base font-bold leading-none ${active ? "text-white" : "text-gray-300"}`}>—</span>
                    <span className={`text-sm mt-0.5 ${active ? "text-white/60" : "text-gray-300"}`}>{label}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Départ ── */}
      <div>
        <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Lieu de départ</label>
        <input
          value={form.start_location_name}
          onChange={(e) => handleChange("start_location_name", e.target.value)}
          placeholder="Ville de départ"
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
        />
        {user?.location_name && form.start_location_name !== user.location_name && (
          <button
            onClick={() => {
              handleChange("start_location_name", user.location_name);
              handleChange("start_latitude", user.location_latitude);
              handleChange("start_longitude", user.location_longitude);
            }}
            className="text-xs text-indigo-500 mt-1"
          >
            Utiliser mon domicile ({user.location_name})
          </button>
        )}
      </div>

      {/* ── Destination (auto-remplie) ── */}
      {form.end_location_name && (
        <div>
          <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Destination</label>
          <div className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-500">
            {form.end_location_name}
          </div>
        </div>
      )}

      {/* ── Véhicule ── */}
      <div>
        <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Véhicule</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={form.vehicle_id}
              onChange={(e) => handleChange("vehicle_id", e.target.value)}
              className="w-full appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-300 text-gray-900"
            >
              <option value="">Sélectionner...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · {v.seats} places
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowVehicleModal(true)}
            className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition flex-shrink-0"
          >
            <Plus size={18} className="text-indigo-600" />
          </button>
        </div>
      </div>

      {/* ── Erreur ── */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ── Soumettre ── */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {submitting ? "Création..." : "Créer le trajet"}
      </button>

      {/* ── Modale véhicule ── */}
      {showVehicleModal && (
        <VehicleModal
          onClose={() => setShowVehicleModal(false)}
          onCreated={handleVehicleCreated}
        />
      )}
    </div>
  );
}

export default CreateTravel;