import { AlertTriangle } from "lucide-react";

function ConfirmModal({ title, description, confirmLabel, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-bg-surface w-full max-w-lg rounded-t-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-danger-bg">
            <AlertTriangle size={18} className="text-danger-text" />
          </div>
          <div>
            <p className="text-base font-medium text-text-primary">{title}</p>
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm text-text-secondary hover:bg-bg-raised transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm text-danger-text font-medium bg-danger-bg hover:brightness-95 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;