import { useNavigate } from "react-router-dom";
import { Map } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 text-center">

      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-primary-subtle flex items-center justify-center">
          <Map size={48} className="text-primary opacity-40" />
        </div>
        <span className="absolute -top-2 -right-2 text-4xl font-bold text-primary opacity-20 select-none">
          ?
        </span>
      </div>

      {/* Texte */}
      <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Erreur 404</p>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Page introuvable</h1>
      <p className="text-sm text-text-muted max-w-xs">
        Cette route n'existe pas ou a été déplacée.
      </p>

      {/* Action */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-primary text-primary-text px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-hover transition"
      >
        Retour à la carte
      </button>
    </div>
  );
}