import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { API_URLS } from "../../utils";

function CompetitionSearch({ onSelect }) {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length >= 2) {
        fetch(`${API_URLS.competitions}?q=${query}`, {
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
    setQuery(c.name);
    setFocused(false);
    setResults([]);
    onSelect(c);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
        Compétition
      </label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Rechercher une compétition..."
          className="w-full pl-9 pr-3 py-2.5 bg-bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
        />
        {focused && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border rounded-lg shadow-md z-10 overflow-hidden">
            {results.map((c) => (
              <div
                key={c.id}
                onMouseDown={() => handleSelect(c)}
                className="px-4 py-3 hover:bg-bg-raised cursor-pointer border-b border-border last:border-none"
              >
                <p className="text-sm font-medium text-text-primary">{c.name}</p>
                <p className="text-xs text-text-muted">{c.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompetitionSearch;