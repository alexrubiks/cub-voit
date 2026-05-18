import { Car, Pencil, User, Users } from "lucide-react";
import PersonCard from "../passengers/PersonCard";

function TravelCard({ travel, detailed, past, onClick, status }) {
  const day = travel.date ? new Date(travel.date).getDate() : null;
  const month = travel.date
    ? new Date(travel.date).toLocaleString("fr-FR", { month: "short" })
    : null;

  const borderColor = {
    passenger: "border-indigo-600",
    available: "border-emerald-500",
    full: "border-amber-500",
  };

  const statusBorder = past
  ? "opacity-70 border-gray-300"
  : borderColor[status];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 shadow-sm p-4 active:scale-[0.98] transition cursor-pointer ${statusBorder}`}
    >
      <div className="flex justify-between items-start gap-3">

        {/* Gauche : nom + itinéraire */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-xl leading-tight ${past ? "text-gray-500" : "text-gray-900"}`}>
            {travel.competition.name}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {travel.start_location_name} → {travel.end_location_name}
          </p>
        </div>

        {/* Droite : bloc date */}
        {day ? (
          <div className={`flex flex-col items-center justify-center w-12 shrink-0 ${past ? "text-gray-400" : "text-indigo-600"}`}>
            <span className="text-2xl font-bold leading-none">{day}</span>
            <span className="text-xs lowercase mt-0.5">{month}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 shrink-0">—</span>
        )}
      </div>

      {/* Détail déroulant */}
      {detailed && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">

          {/* Véhicule */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Car size={18} className="text-indigo-600" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">{travel.vehicle?.name}</p>
              <p className="text-xs text-gray-400">{travel.vehicle?.seats} places</p>
            </div>
            {/* Bouton modifier */}
            <button
              onClick={(e) => { e.stopPropagation(); /* navigate to edit */ }}
              className="ml-auto w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-indigo-50 transition"
            >
              <Pencil size={14} className="text-gray-400 hover:text-indigo-600" />
            </button>
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
        </div>
      )}
    </div>
  );
}

export default TravelCard;