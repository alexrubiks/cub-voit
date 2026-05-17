import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Route, Map, User } from "lucide-react";

const tabs = [
  { label: "Créer", icon: Plus, path: "/create" },
  { label: "Trajets", icon: Route, path: "/travels" },
  { label: "Carte", icon: Map, path: "/" },
  { label: "Compte", icon: User, path: "/account" },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => 
  path === "/" 
    ? location.pathname === "/" 
    : location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-16 flex items-center">
      {tabs.map(({ label, icon: Icon, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className="flex-1 flex flex-col items-center justify-center gap-1"
        >
          <Icon
            size={22}
            className={isActive(path) ? "text-indigo-600" : "text-gray-400"}
            strokeWidth={isActive(path) ? 2.5 : 1.8}
          />
          <span className={`text-[11px] ${isActive(path) ? "text-indigo-600 font-medium" : "text-gray-400"}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default BottomNav;