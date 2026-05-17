import { User } from "lucide-react";

function PersonCard({ user, role }) {
  const isDriver = role === "driver";
  const avatarUrl = user.avatar ? user.avatar : null;

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatarUrl
          ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
          : <User size={16} className="text-indigo-400" />
        }
      </div>

      {/* Texte */}
      <div className="leading-tight">
        <p className="text-sm font-medium text-gray-900">{user.pseudo}</p>
        {isDriver && (
          <p className="text-xs text-indigo-500">Conducteur</p>
        )}
      </div>
    </div>
  );
}

export default PersonCard;