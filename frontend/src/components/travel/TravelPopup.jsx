import { X, Car, User, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TravelPopup({ travel, currentUserId, onClose }) {
  if (!travel) return null;

  const isOwner = travel.owner?.id === currentUserId;
  const isPassenger = travel.passengers?.some((p) => p.id === currentUserId);

  const day = travel.date ? new Date(travel.date + "T00:00:00Z").getUTCDate() : null;
  const month = travel.date
    ? new Date(travel.date + "T00:00:00Z").toLocaleString("fr-FR", { month: "short" })
    : null;

  const navigate = useNavigate();

  return (
    <div className="fixed inset-x-0 bottom-16 z-[1000] flex items-end justify-center">
      {/* Fond cliquable pour fermer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Popup */}
      <div className="bg-white w-full max-w-lg rounded-t-2xl shadow-xl relative">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isOwner && (
                <span className="text-[10px] uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  Mon trajet
                </span>
              )}
              {isPassenger && !isOwner && (
                <span className="text-[10px] uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  Passager
                </span>
              )}
              {!isOwner && !isPassenger && (
                <span className="text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
                  Disponible
                </span>
              )}
            </div>
            <p className="text-base font-medium text-gray-900">{travel.name}</p>
          </div>
          {day && (
            <div className="flex flex-col items-center text-indigo-600 ml-4 flex-shrink-0">
              <span className="text-2xl font-bold leading-none">{day}</span>
              <span className="text-xs lowercase">{month}</span>
            </div>
          )}
          <button onClick={onClose} className="ml-4 flex-shrink-0">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Contenu */}
        <div className="px-5 pb-4 space-y-3">

          {/* Itinéraire */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
              <MapPin size={15} className="text-gray-400" />
            </span>
            <p className="text-sm text-gray-600">
              {travel.start_location_name}
              <span className="text-gray-400 mx-1">→</span>
              {travel.end_location_name}
            </p>
          </div>

          {/* Véhicule */}
          {travel.vehicle && (
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Car size={15} className="text-gray-400" />
              </span>
              <p className="text-sm text-gray-600">
                {travel.vehicle.name}
                <span className="text-gray-400 mx-1">·</span>
                {travel.vehicle.seats} places
              </p>
            </div>
          )}

          {/* Conducteur */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-indigo-400" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                {travel.owner?.avatar
                  ? <img src={travel.owner.avatar} className="w-full h-full object-cover" alt="" />
                  : <span className="text-[10px] text-indigo-500">{travel.owner?.pseudo?.[0]}</span>
                }
              </div>
              <p className="text-sm text-gray-600">{travel.owner?.pseudo}</p>
            </div>
          </div>

          {/* Passagers */}
          {travel.passengers?.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={15} className="text-gray-400" />
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {travel.passengers.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden">
                      {p.avatar
                        ? <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                        : <span className="text-[9px] text-indigo-500">{p.pseudo?.[0]}</span>
                      }
                    </div>
                    <span className="text-xs text-gray-600">{p.pseudo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton voir plus */}
        <div className="px-5 pb-5">
          <button
            onClick={() => { onClose(); navigate(`/travels?search=${encodeURIComponent(travel.competition?.name ?? travel.name)}`); }}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
}

export default TravelPopup;