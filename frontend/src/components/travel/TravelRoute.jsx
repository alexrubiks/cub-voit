import { Polyline } from "react-leaflet";
import { useRoute } from "../../hooks/useRoute";

function getCSSVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function TravelRoute({ travel, currentUserId, onClick }) {
  const route = useRoute(
    { lat: travel.start_latitude, lng: travel.start_longitude },
    { lat: travel.end_latitude, lng: travel.end_longitude }
  );

  if (!route.length) return null;

  const isMine = travel.owner?.id === currentUserId
    || travel.passengers?.some((p) => p.id === currentUserId);

  const color = isMine
    ? getCSSVar("--route-mine")
    : getCSSVar("--route-other");

  return (
    <Polyline
      positions={route}
      pathOptions={{
        color,
        weight: 4,
        opacity: 1,
      }}
      eventHandlers={{
        click: () => onClick(travel),
      }}
    />
  );
}

export default TravelRoute;