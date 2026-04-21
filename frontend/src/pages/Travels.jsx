import TravelList from "../components/TravelList";
import { travels } from "../data/travels";

function Travel() {
  return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">
          Mes trajets
        </h1>

        <TravelList travels={travels} />
      </div>
  );
}

export default Travel;