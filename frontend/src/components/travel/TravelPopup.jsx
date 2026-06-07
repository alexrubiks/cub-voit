import { X, Car, User, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TravelPopup({ travel, currentUserId, onClose }) {
  if (!travel) return null;

  const isOwner     = travel.owner?.id === currentUserId;
  const isPassenger = travel.passengers?.some((p) => p.id === currentUserId);

  const day = travel.date ? new Date(travel.date + "T00:00:00Z").getUTCDate() : null;
  const month = travel.date
    ? new Date(travel.date + "T00:00:00Z").toLocaleString("fr-FR", { month: "short" })
    : null;

  const navigate = useNavigate();

  return (
    <div className="fixed inset-x-0 bottom-16 z-[1000] flex items-end justify-center">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-bg-surface w-full max-w-lg rounded-t-xl shadow-lg relative">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-bg-raised rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isOwner && (
                <span className="text-[10px] uppercase tracking-widest bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">
                  Mon trajet
                </span>
              )}
              {isPassenger && !isOwner && (
                <span className="text-[10px] uppercase tracking-widest bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">
                  Passager
                </span>
              )}
              {!isOwner && !isPassenger && (
                <span className="text-[10px] uppercase tracking-widest bg-success-bg text-success-text px-2 py-0.5 rounded-full font-medium">
                  Disponible
                </span>
              )}
            </div>
            <p className="text-base font-medium text-text-primary">{travel.name}</p>
          </div>
          {day && (
            <div className="flex flex-col items-center text-primary ml-4 flex-shrink-0">
              <span className="text-2xl font-bold leading-none">{day}</span>
              <span className="text-xs lowercase">{month}</span>
            </div>
          )}
          <button onClick={onClose} className="ml-4 flex-shrink-0 hover:text-text-primary transition">
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Contenu */}
        <div className="px-5 pb-4 space-y-3">

          {/* Itinéraire */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-bg-raised flex items-center justify-center flex-shrink-0">
              <MapPin size={15} className="text-text-muted" />
            </span>
            <p className="text-sm text-text-secondary">
              {travel.start_location_name}
              <span className="text-text-muted mx-1">→</span>
              {travel.end_location_name}
            </p>
          </div>

          {/* Véhicule */}
          {travel.vehicle && (
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-bg-raised flex items-center justify-center flex-shrink-0">
                <Car size={15} className="text-text-muted" />
              </span>
              <p className="text-sm text-text-secondary">
                {travel.vehicle.name}
                <span className="text-text-muted mx-1">·</span>
                {travel.vehicle.seats} places
              </p>
            </div>
          )}

          {/* Conducteur */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-primary" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-subtle border border-border flex items-center justify-center overflow-hidden">
                {travel.owner?.avatar
                  ? <img src={travel.owner.avatar} className="w-full h-full object-cover" alt="" />
                  : <span className="text-[10px] text-primary">{travel.owner?.pseudo?.[0]}</span>
                }
              </div>
              <p className="text-sm text-text-secondary">{travel.owner?.pseudo}</p>
            </div>
          </div>

          {/* Passagers */}
          {travel.passengers?.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-bg-raised flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={15} className="text-text-muted" />
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {travel.passengers.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-bg-raised rounded-full px-2.5 py-1">
                    <div className="w-5 h-5 rounded-full bg-primary-subtle border border-border flex items-center justify-center overflow-hidden">
                      {p.avatar
                        ? <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                        : <span className="text-[9px] text-primary">{p.pseudo?.[0]}</span>
                      }
                    </div>
                    <span className="text-xs text-text-secondary">{p.pseudo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bouton voir plus */}
        <div className="px-5 pb-5">
          <button
            onClick={() => {
              onClose();
              navigate(`/travels?search=${encodeURIComponent(travel.competition?.name ?? travel.name)}`);
            }}
            className="w-full bg-primary text-primary-text rounded-lg py-3 text-sm font-medium hover:bg-primary-hover transition"
          >
            Voir plus
          </button>
        </div>

      </div>
    </div>
  );
}

export default TravelPopup;