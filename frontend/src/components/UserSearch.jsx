import { useState } from "react";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;

    const res = await fetch(`http://127.0.0.1:8000/api/users/?search=${query}`, {
      credentials: 'include'
    });
    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un utilisateur"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Rechercher</button>

      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.pseudo} ({user.wca_id})</li>
        ))}
      </ul>
    </div>
  );
}