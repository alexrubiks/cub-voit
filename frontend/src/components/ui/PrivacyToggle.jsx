import { Globe, Lock } from "lucide-react";

function PrivacyToggle({ value, onChange }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
        Visibilité
      </label>
      <div className="flex rounded-lg overflow-hidden border border-border bg-bg-surface">
        <button
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            !value
              ? "bg-primary text-primary-text"
              : "text-text-muted hover:bg-bg-raised"
          }`}
        >
          <Globe size={16} />
          Public
        </button>
        <div className="w-px bg-border" />
        <button
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            value
              ? "bg-primary text-primary-text"
              : "text-text-muted hover:bg-bg-raised"
          }`}
        >
          <Lock size={16} />
          Cercle privé
        </button>
      </div>
      <p className="text-xs text-text-muted mt-1.5 px-1">
        {value
          ? "Visible uniquement par ton cercle privé"
          : "Visible par tous les utilisateurs"
        }
      </p>
    </div>
  );
}

export default PrivacyToggle;