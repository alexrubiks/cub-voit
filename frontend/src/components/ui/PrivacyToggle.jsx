import { Globe, Lock } from "lucide-react";

function PrivacyToggle({ value, onChange }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-400 mb-2 block">
        Visibilité
      </label>
      <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-white">
        <button
          onClick={() => onChange(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            !value
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Globe size={16} />
          Public
        </button>
        <div className="w-px bg-gray-200" />
        <button
          onClick={() => onChange(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition ${
            value
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Lock size={16} />
          Cercle privé
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1.5 px-1">
        {value
          ? "Visible uniquement par ton cercle privé"
          : "Visible par tous les utilisateurs"
        }
      </p>
    </div>
  );
}

export default PrivacyToggle;