import { useState } from "react";
import { API_URLS } from "../../utils";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`${API_URLS.users}?search=${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setResults(data.results ?? data);
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