import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mail } from "lucide-react";

const CONTACT_EMAIL = "wcalexrubiks@gmail.com";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-base">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center hover:bg-bg-raised transition"
        >
          <ChevronLeft size={18} className="text-text-muted" />
        </button>
        <h1 className="text-lg font-medium text-text-primary">Nous contacter</h1>
      </div>

      <div className="px-4 pt-8 pb-8 flex flex-col items-center text-center gap-6">

        {/* Illustration */}
        <div className="w-20 h-20 rounded-full bg-primary-subtle flex items-center justify-center">
          <Mail size={32} className="text-primary" />
        </div>

        {/* Texte */}
        <div className="space-y-2 max-w-xs">
          <h2 className="text-xl font-semibold text-text-primary">Un bug ? Une idée ?</h2>
          <p className="text-sm text-text-muted leading-relaxed">
            N'hésite pas à nous écrire — chaque retour compte pour améliorer CubVoit.
          </p>
        </div>

        {/* Bouton */}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="flex items-center gap-2 bg-primary text-primary-text px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-hover transition"
        >
          <Mail size={16} />
          Ouvrir l'application mail
        </a>

        {/* Email affiché */}
        <p className="text-xs text-text-disabled">{CONTACT_EMAIL}</p>

      </div>
    </div>
  );
}