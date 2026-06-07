import { User } from "lucide-react";

function PersonCard({ user, role }) {
  const isDriver = role === "driver";

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary-subtle border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
        {user.avatar
          ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
          : <User size={16} className="text-primary" />
        }
      </div>
      <div className="leading-tight">
        <p className="text-sm font-medium text-text-primary">{user.pseudo}</p>
        {isDriver && (
          <p className="text-xs text-primary">Conducteur</p>
        )}
      </div>
    </div>
  );
}

export default PersonCard;