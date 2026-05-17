import { useState, useEffect } from "react";
import { Search } from "lucide-react";

function CompetitionSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length >= 2) {
        fetch(`http://localhost:8000/api/competitions-search/?q=${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
          .then((res) => res.json())
          .then(setResults);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (c) => {
    setSelected(c);
    setQuery(c.name);
    setFocused(false);
    setResults([]);
    onSelect(c);  // remonte la compétition choisie vers CreateTravel
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Compétition
      </label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Rechercher une compétition..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-indigo-300"
        />
        {focused && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-md z-10 overflow-hidden">
            {results.map((c) => (
              <div
                key={c.id}
                onMouseDown={() => handleSelect(c)}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-none"
              >
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompetitionSearch;