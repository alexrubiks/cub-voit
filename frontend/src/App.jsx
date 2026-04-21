import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Travels from "./pages/Travels";
import Map from "./pages/Map";
import CreateTravel from "./pages/CreateTravel";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        
        <Route path="/" element={<Travels />} />
        <Route path="/map" element={<Map />} />
        <Route path="/create" element={<CreateTravel />} />
        <Route path="/account" element={<Account />} />

      </Route>
    </Routes>
  );
}

export default App;