import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

import Login from "./pages/Login";
import Travels from "./pages/Travels";
import Map from "./pages/Map";
import CreateTravel from "./pages/CreateTravel";
import Account from "./pages/Account";
import AccountProfile from "./pages/account/AccountProfile";
import AccountSecurity from "./pages/account/AccountSecurity";
import AccountWhitelist from "./pages/account/AccountWhitelist";
import ScrollToTop from "./components/navigation/ScrollToTop";
import UserProvider from "./context/UserProvider";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import ThemeProvider from "./context/ThemeProvider";
import NotFound from "./pages/NotFound";
import Contact from "./pages/support/Contact";
import FAQ from "./pages/support/FAQ";
import CGU from "./pages/legal/CGU";
import Privacy from "./pages/legal/Privacy";

// dans le JSX :


function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Map />} />
            <Route path="/travels" element={<Travels />} />
            <Route path="/create" element={<CreateTravel />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/profile" element={<AccountProfile />} /> 
            <Route path="/account/security" element={<AccountSecurity />} />
            <Route path="/account/whitelist" element={<AccountWhitelist />} />
            <Route path="/support/contact" element={<Contact />} />
            <Route path="/support/faq" element={<FAQ />} />
            <Route path="/legal/cgu" element={<CGU />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;