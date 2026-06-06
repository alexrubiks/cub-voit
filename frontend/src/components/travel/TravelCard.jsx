import { useState, useContext } from "react";
import { Car, Pencil, User, Users, Check, LogOut, Trash2, MapPin, UserPlus, Lock, Globe } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import PersonCard from "../passengers/PersonCard";
import DatePicker from "../ui/DatePicker";
import VehicleSelect from "../vehicle/VehicleSelect";
import PassengerSearch from "../passengers/PassengerSearch";
import MapPickerModal from "../ui/MapPickerModal";
import ConfirmModal from "../ui/ConfirmModal";
import PrivacyToggle from "../ui/PrivacyToggle";
import { API_URLS } from "../../utils";

function TravelCard({ travel, detailed, past, onClick, status, onUpdated, onDeleted }) {
  const { user } = useContext(UserContext);
  const isOwner = travel.owner?.id === user?.id;
  const isPassenger = travel.passengers?.some((p) => p.id === user?.id);

  // ─── États édition ────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    is_private: travel.is_private ?? false,
    date: travel.date ?? "",
    start_location_name: travel.start_location_name ?? "",
    start_latitude: travel.start_latitude ?? null,
    start_longitude: travel.start_longitude ?? null,
    vehicle_id: travel.vehicle?.id ?? "",
  });
  const [selectedVehicle, setSelectedVehicle] = useState(travel.vehicle ?? null);
  const [passengers, setPassengers] = useState(travel.passengers ?? []);
  const [showMap, setShowMap] = useState(false);
  const [saving, setSaving] = useState(false);

  // ─── Modales ──────────────────────────────────────────────────────────
  const [showLeave, setShowLeave] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // ─── Validation capacité ──────────────────────────────────────────────
  const maxPassengers = (selectedVehicle?.seats ?? travel.vehicle?.seats ?? 0) - 1;
  const overCapacity = passengers.length > maxPassengers;

  // ─── Sauvegarde ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (overCapacity) return;
    setSaving(true);

    // 1. PATCH les champs du trajet
    const res = await fetch(`${API_URLS.travels}${travel.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const updated = await res.json();

      // 2. Sync passagers — retire les excédentaires, ajoute les nouveaux
      const originalIds = travel.passengers.map((p) => p.id);
      const newIds = passengers.map((p) => p.id);

      const toRemove = originalIds.filter((id) => !newIds.includes(id));
      const toAdd = newIds.filter((id) => !originalIds.includes(id));

      await Promise.all([
        ...toRemove.map((id) =>
          fetch(`${API_URLS.travels}${travel.id}/remove_passenger/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ user_id: id }),
          })
        ),
        ...toAdd.map((id) =>
          fetch(`${API_URLS.travels}${travel.id}/add_passenger/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ user_id: id }),
          })
        ),
      ]);

      onUpdated?.(updated);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setForm({
      is_private: travel.is_private ?? false,
      date: travel.date ?? "",
      start_location_name: travel.start_location_name ?? "",
      start_latitude: travel.start_latitude ?? null,
      start_longitude: travel.start_longitude ?? null,
      vehicle_id: travel.vehicle?.id ?? "",
    });
    setSelectedVehicle(travel.vehicle ?? null);
    setPassengers(travel.passengers ?? []);
    setEditing(false);
  };

  // ─── Rejoindre le trajet ──────────────────────────────────────────────
  const [_, setJoining] = useState(false);

  const handleJoin = async () => {
    setJoining(true);
    const res = await fetch(`${API_URLS.travels}${travel.id}/add_passenger/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ user_id: user.id }),
    });
    if (res.ok) {
      // Refetch le trajet complet pour avoir les données à jour
      const updated = await fetch(`${API_URLS.travels}${travel.id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await updated.json();
      onUpdated?.(data);
    }
    setJoining(false);
  };

  // ─── Quitter le trajet ────────────────────────────────────────────────
  const handleLeave = async () => {
    const res = await fetch(`${API_URLS.travels}${travel.id}/remove_passenger/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ user_id: user.id }),
    });
    if (res.ok) {
      // Refetch le trajet complet
      const updated = await fetch(`${API_URLS.travels}${travel.id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await updated.json();
      onUpdated?.(data);
    }
    setShowLeave(false);
  };

  // ─── Supprimer le trajet ──────────────────────────────────────────────
  const handleDelete = async () => {
    await fetch(`${API_URLS.travels}${travel.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    onDeleted?.(travel.id);
  };

  // ─── Affichage date ───────────────────────────────────────────────────
  const day = travel.date ? new Date(travel.date + "T00:00:00Z").getUTCDate() : null;
  const month = travel.date
    ? new Date(travel.date + "T00:00:00Z").toLocaleString("fr-FR", { month: "short" })
    : null;

  const borderColor = {
    passenger: "border-indigo-600",
    available: "border-emerald-500",
    full: "border-amber-500",
  };
  const statusBorder = past ? "opacity-70 border-gray-300" : borderColor[status];

  return (
    <>
      <div
        onClick={editing ? undefined : onClick}
        className={`bg-white rounded-2xl border-2 shadow-sm p-4 transition ${!editing ? "active:scale-[0.98] cursor-pointer" : ""} ${statusBorder}`}
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className={`font-bold text-xl leading-tight ${past ? "text-gray-500" : "text-gray-900"}`}>
              {travel.competition?.name}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              {editing ? form.start_location_name : travel.start_location_name} → {travel.end_location_name}
            </p>
          </div>
          {day ? (
            <div className={`flex flex-col items-center justify-center w-12 shrink-0 ${past ? "text-gray-400" : "text-indigo-600"}`}>
              <span className="text-2xl font-bold leading-none">{day}</span>
              <span className="text-xs lowercase mt-0.5">{month}</span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 shrink-0">—</span>
          )}
        </div>

        {/* ── Détail déroulant ── */}
        {detailed && (
          <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">

            {editing ? (
              <>
                {/* Visibilité */}
                <PrivacyToggle
                  value={form.is_private}
                  onChange={(val) => setForm((p) => ({ ...p, is_private: val }))}
                />

                {/* Date */}
                <DatePicker
                  selectedCompetition={{ date: travel.competition?.first_day ?? travel.date }}
                  onChange={(date) => setForm((p) => ({ ...p, date }))}
                />

                {/* Départ */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">Lieu de départ</label>
                  <button
                    onClick={() => setShowMap(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 transition"
                  >
                    <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                    <span className={`text-sm ${form.start_location_name ? "text-gray-900" : "text-gray-400"}`}>
                      {form.start_location_name || "Choisir sur la carte..."}
                    </span>
                  </button>
                </div>

                {/* Véhicule */}
                <VehicleSelect
                  value={form.vehicle_id}
                  onChange={(vehicle) => {
                    setSelectedVehicle(vehicle);
                    setForm((p) => ({ ...p, vehicle_id: vehicle.id }));
                  }}
                />

                {/* Passagers */}
                <div>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
                    Passagers {passengers.length}/{maxPassengers}
                  </label>
                  <PassengerSearch
                    vehicle={selectedVehicle ?? travel.vehicle}
                    passengers={passengers}
                    onAdd={(u) => setPassengers((prev) => [...prev, u])}
                    onRemove={(u) => setPassengers((prev) => prev.filter((p) => p.id !== u.id))}
                  />
                  {overCapacity && (
                    <p className="text-xs text-red-400 mt-1">
                      Trop de passagers — retirer des passagers ou changer de véhicule pour continuer
                    </p>
                  )}
                </div>

                {/* Actions édition */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowDelete(true)}
                    className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={overCapacity || saving}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-40 transition"
                  >
                    {saving ? "..." : "Sauvegarder"}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Visibilité */}
                {isOwner && (
                  <div className="flex">
                    {travel.is_private ? (
                      <span className="text-[10px] uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Lock size={10} /> privé
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Globe size={10} /> Public
                      </span>
                    )}
                  </div>
                )}

                {/* Véhicule */}
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Car size={18} className="text-indigo-600" />
                  </span>
                  <div className="leading-tight flex-1">
                    <p className="text-sm font-medium text-gray-900">{travel.vehicle?.name}</p>
                    <p className="text-xs text-gray-400">{travel.vehicle?.seats} places</p>
                  </div>
                  {isOwner && !past && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition"
                    >
                      <Pencil size={14} className="text-gray-400 hover:text-indigo-600" />
                    </button>
                  )}
                </div>

                {/* Conducteur */}
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <User size={18} className="text-indigo-600" />
                  </span>
                  <PersonCard user={travel.owner} role="driver" />
                </div>

                {/* Passagers */}
                {travel.passengers?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
                      <Users size={18} className="text-gray-400" />
                    </span>
                    <div className="space-y-1.5 flex-1">
                      {travel.passengers.map((p) => (
                        <PersonCard key={p.id} user={p} role="passenger" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton rejoindre (disponible uniquement) */}
                {!isOwner && !isPassenger && !past && status === "available" && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleJoin(); }}
                      className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                    >
                      <UserPlus size={13} /> Rejoindre
                    </button>
                  </div>
                )}

                {/* Bouton quitter (passager uniquement) */}
                {isPassenger && !isOwner && !past && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowLeave(true); }}
                      className="flex items-center gap-1.5 text-xs text-red-400 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                    >
                      <LogOut size={13} /> Quitter le trajet
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modales */}
      {showMap && (
        <MapPickerModal
          initialLat={form.start_latitude}
          initialLng={form.start_longitude}
          onClose={() => setShowMap(false)}
          onConfirm={({ start_location_name, start_latitude, start_longitude }) => {
            setForm((p) => ({ ...p, start_location_name, start_latitude, start_longitude }));
          }}
        />
      )}
      {showLeave && (
        <ConfirmModal
          title="Quitter le trajet"
          description="Tu seras retiré de ce trajet. Le conducteur sera notifié."
          confirmLabel="Quitter"
          onConfirm={handleLeave}
          onClose={() => setShowLeave(false)}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Supprimer le trajet"
          description="Le trajet sera supprimé définitivement pour tous les participants."
          confirmLabel="Supprimer"
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
}

export default TravelCard;