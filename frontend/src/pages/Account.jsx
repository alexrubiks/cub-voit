import { useContext } from "react";
import { ChevronRight, Edit2, User, Lock, Bell, HelpCircle, MessageCircle, FileText, Shield, LogOut } from "lucide-react";
import { UserContext } from "../context/UserContext";

const iconColors = {
  teal: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-gray-100 text-gray-500",
};

const menuGroups = [
  {
    title: "Mon compte",
    items: [
      { icon: User, label: "Informations personnelles", sub: "Nom, adresse, téléphone", color: "teal", href: "/account/profile" },
      { icon: Lock, label: "Sécurité", sub: "Mot de passe, 2FA", color: "teal", href: "/account/security" },
      { icon: Bell, label: "Notifications", badge: "3 actives", color: "blue", href: "/account/notifications" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "FAQ", color: "amber", href: "/faq" },
      { icon: MessageCircle, label: "Nous contacter", color: "amber", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    items: [
      { icon: FileText, label: "CGU", color: "gray", href: "/legal/cgu" },
      { icon: Shield, label: "Politique de confidentialité", color: "gray", href: "/legal/privacy" },
    ],
  },
];

function MenuRow({ item }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[item.color]}`}>
        <Icon size={17} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{item.label}</p>
        {item.sub && <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>}
      </div>
      {item.badge && (
        <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
    </a>
  );
}

export default function Account() {
  const { user } = useContext(UserContext);

  if (!user) return <p>Chargement...</p>;

  const initials = (user.first_name?.[0] ?? "") + (user.last_name?.[0] ?? "");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="px-5 pt-10 pb-8 flex flex-col items-center gap-2.5 relative">
        <button
          className="absolute top-4 right-4 flex items-center gap-1.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
          onClick={() => {/* navigate to edit */}}
        >
          <Edit2 size={14} /> Modifier
        </button>

        <div className="w-[72px] h-[72px] rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-700 text-2xl font-medium overflow-hidden">
          {user.avatar
            ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
            : initials
          }
        </div>

        <div className="text-center">
          <p className="text-gray-900 text-lg font-medium">{user.first_name} {user.last_name}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Menu groups */}
      <div className="px-4 pt-6 pb-8 flex flex-col gap-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2 px-1">
              {group.title}
            </p>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {group.items.map((item) => (
                <MenuRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}

        {/* Déconnexion */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-gray-100 text-red-500 text-sm"
          onClick={() => {/* logout logic */}}
        >
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}