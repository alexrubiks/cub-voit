import { useContext } from "react";
import { ChevronRight, Edit2, User, Lock, Bell, HelpCircle, MessageCircle, FileText, Shield, LogOut, Camera } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

const iconColors = {
  indigo: "bg-indigo-50 text-indigo-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-gray-100 text-gray-500",
};

const menuGroups = [
  {
    title: "Mon compte",
    items: [
      { icon: User, label: "Informations personnelles", sub: "Pseudo, mail, domicile", color: "indigo", href: "/account/profile" },
      { icon: Lock, label: "Sécurité", sub: "Mot de passe, activité du compte", color: "indigo", href: "/account/security" },
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
    <Link
      to={item.href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[item.color]}`}>
        <Icon size={17} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-base text-gray-900">{item.label}</p>
        {item.sub && <p className="text-sm text-gray-400 mt-0.5">{item.sub}</p>}
      </div>
      {item.badge && (
        <span className="text-sm bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
      <ChevronRight size={18} className="text-gray-500 flex-shrink-0" />
    </Link>
  );
}

export default function Account() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  if (!user) return <p>Chargement...</p>;

  const avatarUrl = user.avatar || null;

  console.log(avatarUrl)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User */}
      <div className="px-5 pt-10 pb-8 flex flex-col items-center gap-2.5 relative">
        <button
          className="absolute top-4 right-4 flex items-center gap-1.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
          onClick={() => {/* navigate to edit */}}
        >
          <Edit2 size={14} /> Modifier
        </button>
        
        <div
          className="w-[120px] h-[120px] rounded-full bg-indigo-50 border-2 border-indigo-300 flex items-center justify-center text-indigo-700 text-4xl font-medium overflow-hidden relative group"
        >
          {avatarUrl
            ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
            : user.pseudo?.[0] ?? ""
          }
        </div>

        <div className="text-center">
          <p className="text-gray-900 text-2xl font-bold">{user.pseudo}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Menu groups */}
      <div className="px-4 pt-6 pb-8 flex flex-col gap-5">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-2 px-1">
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
          onClick={handleLogout}
        >
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}