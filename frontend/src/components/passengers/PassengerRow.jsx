import Avatar from "../ui/Avatar";
import { X } from "lucide-react";

function PassengerRow({ user, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary">{user.pseudo}</p>
        {user.wca_id && <p className="text-xs text-text-muted">{user.wca_id}</p>}
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(user)}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-danger-bg transition flex-shrink-0"
        >
          <X size={14} className="text-text-muted hover:text-danger-text transition" />
        </button>
      )}
    </div>
  );
}

export default PassengerRow;