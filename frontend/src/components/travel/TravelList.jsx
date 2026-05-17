import { useState } from "react";
import TravelCard from "./TravelCard";

function TravelList({ travels }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="p-2 space-y-3">
      {travels.map((travel) => (
        <TravelCard
          key={travel.id}
          travel={travel}
          detailed={selectedId === travel.id}
          onClick={() =>
            setSelectedId(
              selectedId === travel.id ? null : travel.id
            )
          }
        />
      ))}
    </div>
  );
}

export default TravelList;