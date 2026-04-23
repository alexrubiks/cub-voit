import { useNavigate } from "react-router-dom";

function CircleActionButton({ icon: Icon, onClick, to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-200 transition"
    >
      <Icon className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export default CircleActionButton;