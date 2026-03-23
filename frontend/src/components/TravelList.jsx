import { useEffect, useState } from "react";
import { getTravels } from "../services/api";

export default function TravelList() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTravels() {
      try {
        const data = await getTravels();
        setTravels(data.results || data);
      } catch (err) {
        setError("Erreur lors du chargement des trajets");
      } finally {
        setLoading(false);
      }
    }

    fetchTravels();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Mes trajets</h2>

      {travels.length === 0 ? (
        <p>Aucun trajet trouvé</p>
      ) : (
        <ul>
          {travels.map((travel) => (
            <li key={travel.id}>
              <strong>{travel.name}</strong><br />
              {travel.start_location_name} → {travel.end_location_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}