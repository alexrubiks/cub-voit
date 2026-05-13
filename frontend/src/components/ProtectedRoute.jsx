import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;