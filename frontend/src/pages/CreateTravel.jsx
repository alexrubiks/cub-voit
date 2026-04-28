import { useState, useEffect } from "react";


function CreateTravel() {
  const [form, setForm] = useState({
    name: "",
    owner: "",

    date: "",
    start_location_name: "", // récupérer champ de l'user
    start_latitude: "",
    start_longitude: "",

    end_location_name: "",
    end_latitude: "",
    end_longitude: "",

    competition: "",
    vehicle: "",
    passengers: [],
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length >= 2) {
        fetch(`http://127.0.0.1:8000/api/competitions-search/?q=${query}`)
          .then((res) => res.json())
          .then(setResults);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl text-black font-bold">Créer un trajet</h1>

      {/* Nom */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // petit délai pour permettre le clic sur une option
          setTimeout(() => setIsFocused(false), 100);
        }}
        className="w-full p-2 border rounded"
      />

      {isFocused && (
      <div className="mt-2 bg-white border rounded shadow absolute w-full z-10">
        {results.map((c, i) => (
          <div
            key={i}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setQuery(c.name);
              setResults([]);
              setIsFocused(false);
              
              handleChange("end_location_name", c.location);
              handleChange("end_latitude", c.end_latitude);
              handleChange("end_longitude", c.end_longitude);
            }}
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-500">
              {c.location}
            </div>
          </div>
        ))}
      </div>
    )}

      {/* Destination */}
      <input
        placeholder="Destination"
        className="w-full p-2 border rounded-lg"
        value={form.end_location_name}
        onChange={(e) =>
          handleChange("end_location_name", e.target.value)
        }
      />
      
      {/* Départ */}
      <input
        placeholder="Lieu de départ"
        className="w-full p-2 border rounded-lg"
        value={form.start_location_name}
        onChange={(e) =>
          handleChange("start_location_name", e.target.value)
        }
      />

      {/* Date (forme à revoir, 3 boutons à sélectionner "le jour même", "la veille", "personnalisé") */}
      <input
        type="date"
        className="w-full p-2 border rounded-lg"
        value={form.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />

      {/* Véhicule */}
      <input
        placeholder="Véhicule"
        className="w-full p-2 border rounded-lg"
        value={form.vehicle}
        onChange={(e) => handleChange("vehicle", e.target.value)}
      />

      {/* Passagers */}
      <input
        placeholder="Ajouter un passager"
        className="w-full p-2 border rounded-lg"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value) {
            handleChange("passengers", [
              ...form.passengers,
              e.target.value,
            ]);
            e.target.value = "";
          }
        }}
      />

      <div className="space-y-2">
        {form.passengers.map((p, i) => (
          <div
            key={i}
            className="p-2 bg-gray-100 rounded-lg text-sm"
          >
            {p}
          </div>
        ))}
      </div>

      <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
        Créer
      </button>
    </div>
  );
}

export default CreateTravel;


// [owner] ajouté automatiquement

// interface de recherche pour [competition]
// [name] -- à retirer dans la structure potentiellement
// [end_location_name]
// [end_latitude]
// [end_longitude]


// champ pour sélectionner le départ
// [start_location_name]
// [start_latitude]
// [start_longitude]

// champ pour sélectionner la date
// [date]

// champ pour sélectionner le véhicule
// [vehicle]
// possibilité de créer un nouveau véhicule

// champ pour ajouter des passagers
// [passengers]
// liste comme pour les vrais trajets avec case grisée d'ajout

// champ pour spécifier si le trajet est public/restreint
// ajouter champ dans la bdd