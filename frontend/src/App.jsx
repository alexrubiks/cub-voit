import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Travels from "./pages/Travels";
import Map from "./pages/Map";
import CreateTravel from "./pages/CreateTravel";
import Account from "./pages/Account";
import UserProvider from "./context/UserProvider";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AppLayout />}>
          
          <Route path="/" element={<Map />} />
          <Route path="/travels" element={<Travels />} />
          <Route path="/create" element={<CreateTravel />} />
          <Route path="/account" element={<Account />} />

        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;