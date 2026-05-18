import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { API_URLS, normalizeUser } from "../utils";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }

      try {
        const res = await fetch(API_URLS.me, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(normalizeUser(data));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;