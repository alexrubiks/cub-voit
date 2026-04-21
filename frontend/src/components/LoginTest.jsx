import { useState } from "react";
import TravelList from "./TravelList";

export default function LoginTest() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [travels, setTravels] = useState([]);

  const handleLogin = async () => {
    try {
      // 1️⃣ Login et récupération du token
      const loginRes = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        console.error("Login failed:", loginData);
        return;
      }

      const accessToken = loginData.access;

      // 2️⃣ Récupérer les travels avec JWT
      const travelsRes = await fetch("http://127.0.0.1:8000/api/travels/", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const travelsData = await travelsRes.json();
      console.log("Travels:", travelsData);

      setTravels(travelsData);

    } catch (err) {
      console.error("Error in login process:", err);
    }
  };

  return (
    <div>
      <h2>Login test</h2>

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}