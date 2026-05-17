import { Polyline } from "react-leaflet";
import { useRoute } from "../hooks/useRoute";

const COLORS = {
  mine: "#6366f1",   // indigo-500 — je suis owner ou passager
  other: "#10b981",  // emerald-500 — trajet disponible d'un autre
};

function TravelRoute({ travel, currentUserId, onClick }) {
  const route = useRoute(
    { lat: travel.start_latitude, lng: travel.start_longitude },
    { lat: travel.end_latitude, lng: travel.end_longitude }
  );

  if (!route.length) return null;

  const isOwner = travel.owner?.id === currentUserId;
  const isPassenger = travel.passengers?.some((p) => p.id === currentUserId);
  const isMine = isOwner || isPassenger;

  return (
    <Polyline
      positions={route}
      pathOptions={{
        color: isMine ? COLORS.mine : COLORS.other,
        weight: isMine ? 5 : 4,
        opacity: isMine ? 0.9 : 0.6,
      }}
      eventHandlers={{
        click: () => onClick(travel),
      }}
    />
  );
}

export default TravelRoute;