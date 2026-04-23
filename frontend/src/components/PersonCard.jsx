import { FaUserAlt } from "react-icons/fa";

function PersonCard({ user, role }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 h-14">
      
      {/* avatar */}
      <FaUserAlt className="w-8 h-8 text-black"/>

      {/* texte */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl text-left font-medium text-black">
          {user.username}
        </span>

        {role === "driver" && (
          <span className="text-base text-left text-red-500 -mt-1">
            conducteur
          </span>
        )}
      </div>

    </div>
  );
}

export default PersonCard;