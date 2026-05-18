import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Travels from "./pages/Travels";
import Map from "./pages/Map";
import CreateTravel from "./pages/CreateTravel";
import Account from "./pages/Account";
import AccountProfile from "./pages/account/AccountProfile";
import UserProvider from "./context/UserProvider";
import ProtectedRoute from "./components/ui/ProtectedRoute";

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
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;