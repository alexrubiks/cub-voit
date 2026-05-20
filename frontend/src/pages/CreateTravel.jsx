import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import CompetitionSearch from "../components/search/CompetitionSearch";
import DatePicker from "../components/ui/DatePicker";
import DepartureField from "../components/ui/DepartureField";
import PassengerSearch from "../components/passengers/PassengerSearch";
import VehicleSelect from "../components/vehicle/VehicleSelect";
import { API_URLS } from "../utils";


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
    passengers: "",
  });

  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengers, setPassengers] = useState([]);

  const overCapacity = selectedVehicle
  ? passengers.length > selectedVehicle.seats - 1
  : false;
  
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.competition_id) { setError("Sélectionner une compétition"); return; }
    if (!form.date) { setError("Choisir une date"); return; }
    if (!form.vehicle_id) { setError("Sélectionner un véhicule"); return; }
    if (!form.start_location_name) { setError("Indiquer un lieu de départ"); return; }

    setSubmitting(true);
    const res = await fetch(API_URLS.travels, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ ...form, passengers_ids: passengers.map((p) => p.id) }),
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

      <CompetitionSearch onSelect={(c) => {
        setSelectedCompetition(c);
        handleChange("competition_id", c.id);
        handleChange("end_location_name", c.location);
        handleChange("end_latitude", c.latitude);
        handleChange("end_longitude", c.longitude);
      }} />

      <DatePicker
        selectedCompetition={selectedCompetition}
        onChange={(date) => handleChange("date", date)}
      />

      <DepartureField
        value={form.start_location_name}
        onChange={(fields) => setForm((prev) => ({ ...prev, ...fields }))}
      />

      {form.end_location_name && (
        <div>
          <label className="text-sm uppercase tracking-widest text-gray-400 mb-2 block">Destination</label>
          <div className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-500">
            {form.end_location_name}
          </div>
        </div>
      )}

      <VehicleSelect
        value={form.vehicle_id}
        onChange={(vehicle) => {
          setSelectedVehicle(vehicle);
          handleChange("vehicle_id", vehicle.id);
        }}
      />

      {selectedVehicle && (
        <PassengerSearch
          vehicle={selectedVehicle}
          passengers={passengers}
          onAdd={(u) => setPassengers((prev) => [...prev, u])}
          onRemove={(u) => setPassengers((prev) => prev.filter((p) => p.id !== u.id))}
        />
      )}
      {overCapacity && (
        <p className="text-xs text-red-400 mt-1">
          Trop de passagers pour ce véhicule — retirer des passagers ou changer de véhicule pour continuer
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={submitting || overCapacity}
        className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {submitting ? "Création..." : "Créer le trajet"}
      </button>
    </div>
  );
}

export default CreateTravel;