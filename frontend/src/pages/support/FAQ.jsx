import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "À quoi sert CubVoit ?",
    a: "CubVoit a été pensé pour faciliter les covoiturages pour se rendre en compétition. Tu peux proposer un trajet, rejoindre celui d'un autre participant, ou voir sur la carte les trajets disponibles passant près de chez toi.",
  },
  {
    q: "Comment créer un trajet ?",
    a: "Depuis l'onglet \"Créer\", sélectionne une compétition, choisis une date, un lieu de départ et un véhicule. Tu peux aussi ajouter des passagers directement.",
  },
  {
    q: "Qu'est-ce que le cercle privé ?",
    a: "C'est une liste de personnes de confiance. Si tu crées un trajet privé, seules les personnes de ton cercle pourront le voir, même sans y être déjà ajoutées comme passagers.",
  },
  {
    q: "Comment connecter mon compte WCA ?",
    a: "Dans Mon Compte → Informations personnelles, tu trouveras un bouton \"Se connecter avec la WCA\". Cela permet d'afficher ton ID WCA sur ton profil.",
  },
  {
    q: "Un trajet privé est-il visible sur la carte ?",
    a: "Non. Les trajets privés n'apparaissent sur la carte que pour toi et les membres de ton cercle privé.",
  },
  {
    q: "Comment quitter un trajet que j'ai rejoint ?",
    a: "Depuis l'onglet Trajets, ouvre la carte du trajet concerné et utilise le bouton \"Quitter le trajet\".",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-bg-surface border border-border rounded-lg overflow-hidden"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-4 py-3.5 cursor-pointer">
        <p className="text-sm font-medium text-text-primary pr-4">{q}</p>
        <ChevronDown
          size={16}
          className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-sm text-text-muted leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
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
        <h1 className="text-lg font-medium text-text-primary">FAQ</h1>
      </div>

      <div className="px-4 pb-8 space-y-2">
        {FAQS.map((item) => (
          <FaqItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

    </div>
  );
}