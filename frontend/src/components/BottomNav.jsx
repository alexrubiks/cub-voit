import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaUserAlt } from "react-icons/fa";
import { TbRouteSquare } from "react-icons/tb";
import { GiFrance } from "react-icons/gi";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const btn = (label, Icon, path) => (
    <button
      onClick={() => navigate(path)}
      className={`flex-1 flex flex-col items-center justify-center h-full ${
        isActive(path) ? "text-blue-600" : "text-gray-500"
      }`}
    >
      <Icon
        className={`w-8 h-8 ${
          isActive(path) ? "opacity-100" : "opacity-60"
        }`}
      />
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md h-16 flex">
      {btn("Create", FaPlus, "/create")}
      {btn("Travels", TbRouteSquare, "/travels")}
      {btn("Map", GiFrance, "/")}
      {btn("Account", FaUserAlt, "/account")}
    </div>
  );
}

export default BottomNav;