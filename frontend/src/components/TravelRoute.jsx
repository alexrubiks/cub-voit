import { Polyline } from "react-leaflet";
import { useRoute } from "../hooks/useRoute";

function TravelRoute({ travel }) {
  const route = useRoute(
    {
      lat: travel.start_latitude,
      lng: travel.start_longitude,
    },
    {
      lat: travel.end_latitude,
      lng: travel.end_longitude,
    }
  );

  if (!route.length) return null;

  return (
    <Polyline
      positions={route}
      pathOptions={{
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
      }}
    />
  );
}

export default TravelRoute;