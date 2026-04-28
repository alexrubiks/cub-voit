import TravelList from "../components/TravelList";
import { travels } from "../data/travels";
import CircleActionButton from "../components/CircleActionButton";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react";

function Travels() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredTravels =
    search.length === 0
      ? travels
      : travels.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-5xl text-black font-bold uppercase leading-none">
          Mes trajets
        </h1>

        <div className="flex gap-2 items-center">
          <CircleActionButton icon={FaMagnifyingGlass} onClick={() => setSearchOpen(!searchOpen)} />
          <CircleActionButton icon={FaPlus} to="/create" />
        </div>
      </div>

      {searchOpen && (
        <input
          type="text"
          placeholder="Rechercher un trajet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
        />
      )}

      {search.length > 0 && filteredTravels.length === 0 ? (
        <p className="text-center text-gray-400 italic mt-6">
          Aucun trajet trouvé
        </p>
      ) : (
        <TravelList travels={filteredTravels} />
      )}
    </div>
  );
}

export default Travels;


// afficher les trajets passés en grisé en bas
// petit bouton crayon pour modif (uniquement en détaillé)