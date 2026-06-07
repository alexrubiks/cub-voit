import { useContext } from "react";
import { ChevronRight, User, Lock, HelpCircle, MessageCircle, FileText, Shield, LogOut, UserRoundCheck, Sun, Moon } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useTheme } from "../hooks/useTheme";
import { useNavigate, Link } from "react-router-dom";

const iconColors = {
  indigo: "bg-primary-subtle text-primary",
  blue:   "bg-info-bg text-info-text",
  amber:  "bg-warning-bg text-warning-text",
  gray:   "bg-bg-raised text-text-muted",
};

const menuGroups = [
  {
    title: "Mon compte",
    items: [
      { icon: User,          label: "Informations personnelles", sub: "Pseudo, email, domicile",      color: "indigo", href: "/account/profile" },
      { icon: Lock,          label: "Sécurité",                  sub: "Mot de passe, activité",       color: "indigo", href: "/account/security" },
      { icon: UserRoundCheck,label: "Cercle privé",              sub: "Utilisateurs autorisés",       color: "blue",   href: "/account/whitelist" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle,    label: "FAQ",              color: "amber", href: "/faq" },
      { icon: MessageCircle, label: "Nous contacter",   color: "amber", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    items: [
      { icon: FileText, label: "CGU",                          color: "gray", href: "/legal/cgu" },
      { icon: Shield,   label: "Politique de confidentialité", color: "gray", href: "/legal/privacy" },
    ],
  },
];

function MenuRow({ item }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-bg-raised transition-colors border-b border-border last:border-none"
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[item.color]}`}>
        <Icon size={17} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-base text-text-primary">{item.label}</p>
        {item.sub && <p className="text-sm text-text-muted mt-0.5">{item.sub}</p>}
      </div>
      {item.badge && (
        <span className="text-sm bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
      <ChevronRight size={18} className="text-text-muted flex-shrink-0" />
    </Link>
  );
}

export default function Account() {
  const { dark, setDark } = useTheme();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="p-2 pb-0">

      {/* Toggle thème */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-surface border border-border flex items-center justify-center z-[9999] hover:bg-bg-raised transition"
      >
        {dark
          ? <Moon size={16} className="text-primary" />
          : <Sun size={16} className="text-text-muted" />
        }
      </button>

      {/* Avatar + infos */}
      <div className="px-5 pt-10 pb-6 flex flex-col items-center gap-2.5">
        <div className="w-[120px] h-[120px] rounded-full bg-primary-subtle border-2 border-primary flex items-center justify-center text-primary text-4xl font-medium overflow-hidden">
          {user.avatar
            ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            : user.pseudo?.[0] ?? ""
          }
        </div>
        <div className="text-center">
          <p className="text-text-primary text-2xl font-bold">{user.pseudo}</p>
          <p className="text-text-muted text-sm">{user.email}</p>
        </div>
      </div>

      {/* Groupes de menu */}
      <div className="px-4 pt-6 pb-8 flex flex-col gap-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-xs uppercase tracking-widest text-text-muted mb-2 px-1">
              {group.title}
            </p>
            <div className="bg-bg-surface rounded-lg border border-border overflow-hidden">
              {group.items.map((item) => (
                <MenuRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-bg-surface rounded-lg border border-border text-danger-text text-sm hover:bg-danger-bg transition"
        >
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}