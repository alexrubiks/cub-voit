import { useEffect, useState } from "react";

const routeCache = {};

export function useRoute(start, end) {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!start || !end) return;

    const key = `${start.lat}-${start.lng}-${end.lat}-${end.lng}`;

    if (routeCache[key]) {
      setRoute(routeCache[key]);
      return;
    }

    async function fetchRoute() {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${start.lng},${start.lat};${end.lng},${end.lat}` +
          `?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes?.length) return;

        const coords = data.routes[0].geometry.coordinates;

        const formatted = coords.map(([lng, lat]) => [lat, lng]);

        routeCache[key] = formatted;

        setRoute(formatted);
      } catch (err) {
        console.error("Erreur OSRM:", err);
      }
    }

    fetchRoute();
  }, [start, end]);

  return route;
}