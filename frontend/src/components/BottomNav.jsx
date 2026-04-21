import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const btn = (label, icon, path) => (
  <button
    onClick={() => navigate(path)}
    className={`flex-1 flex flex-col items-center justify-center h-full ${
      isActive(path) ? "text-blue-600" : "text-gray-500"
    }`}
  >
    <img
      src={icon}
      alt={label}
      className={`w-10 h-10 ${
        isActive(path) ? "opacity-100" : "opacity-60"
      }`}
    />
  </button>
);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md h-16 flex">
      {btn("Create", "/icons/plus.png", "/create")}
      {btn("Travels", "/icons/travels.png", "/")}
      {btn("Map", "/icons/france.png", "/map")}
      {btn("Account", "/icons/user.png", "/account")}
    </div>
  );
}

export default BottomNav;