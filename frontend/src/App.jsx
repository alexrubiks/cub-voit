import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Travels from "./pages/Travels";
import Map from "./pages/Map";
import CreateTravel from "./pages/CreateTravel";
import Account from "./pages/Account";
import UserProvider from "./context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Map />} />
          <Route path="/travels" element={<Travels />} />
          <Route path="/create" element={<CreateTravel />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/profile" element={<AccountProfile />} />
          <Route path="/account/security" element={<AccountSecurity />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;