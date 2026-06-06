import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, LogOut, Trash2, AlertTriangle, Check, Eye, EyeOff } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { API_URLS } from "../../utils";

export default function AccountSecurity() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Mot de passe
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordStatus, setPasswordStatus] = useState(null);

  // Modales
  const [showLogoutAll, setShowLogoutAll] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // ─── Changement de mot de passe ──────────────────────────────────────
  const handlePasswordSave = async () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordStatus("mismatch");
      setTimeout(() => setPasswordStatus(null), 3000);
      return;
    }
    setPasswordStatus("saving");
    const res = await fetch(API_URLS.changePassword, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({
        current_password: passwords.current,
        new_password: passwords.new,
      }),
    });
    if (res.ok) {
      setPasswordStatus("saved");
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      setPasswordStatus("error");
    }
    setTimeout(() => setPasswordStatus(null), 3000);
  };

  // ─── Déconnexion tous appareils ──────────────────────────────────────
  const handleLogoutAll = async () => {
    await fetch(API_URLS.logoutAll, {
      method: "POST",
      headers: authHeader,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  // ─── Suppression du compte ───────────────────────────────────────────
  const handleDeleteAccount = async () => {
    await fetch(API_URLS.deleteAccount, {
      method: "DELETE",
      headers: authHeader,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordComplete = passwords.current && passwords.new && passwords.confirm;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate("/account")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <h1 className="text-lg font-medium text-gray-900">Sécurité</h1>
      </div>

      <div className="px-4 space-y-5 pb-8">

        {/* Mot de passe */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-1">mot de passe</p>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
            {[
              { key: "current", label: "Mot de passe actuel" },
              { key: "new", label: "Nouveau mot de passe" },
              { key: "confirm", label: "Confirmer le nouveau" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    value={passwords[key]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 pr-10 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-indigo-300 bg-white"
                  />
                  <button
                    onClick={() => toggleShow(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords[key]
                      ? <EyeOff size={15} className="text-gray-400" />
                      : <Eye size={15} className="text-gray-400" />
                    }
                  </button>
                </div>
              </div>
            ))}

            {passwordStatus === "mismatch" && (
              <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>
            )}
            {passwordStatus === "error" && (
              <p className="text-xs text-red-400">Mot de passe actuel incorrect</p>
            )}
            {passwordStatus === "saved" && (
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <Check size={11} /> Mot de passe modifié
              </p>
            )}

            <button
              onClick={handlePasswordSave}
              disabled={!passwordComplete || passwordStatus === "saving"}
              className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-40"
            >
              {passwordStatus === "saving" ? "Sauvegarde..." : "Changer le mot de passe"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-1">Compte</p>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowLogoutAll(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition"
            >
              <span className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-amber-500" />
              </span>
              <div className="text-left">
                <p className="text-sm text-gray-900">Déconnecter tous les appareils</p>
                <p className="text-xs text-gray-400">Invalide toutes les sessions actives</p>
              </div>
            </button>
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition"
            >
              <span className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} className="text-red-400" />
              </span>
              <div className="text-left">
                <p className="text-sm text-red-500">Supprimer mon compte</p>
                <p className="text-xs text-gray-400">Action irréversible</p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* Modales de confirmation */}
      {showLogoutAll && (
        <ConfirmModal
          title="Déconnecter tous les appareils"
          description="Tu seras déconnecté de tous tes appareils et devras te reconnecter."
          confirmLabel="Déconnecter"
          onConfirm={handleLogoutAll}
          onClose={() => setShowLogoutAll(false)}
        />
      )}
      {showDeleteAccount && (
        <ConfirmModal
          title="Supprimer mon compte"
          description="Toutes tes données seront supprimées définitivement. Cette action est irréversible."
          confirmLabel="Supprimer"
          onConfirm={handleDeleteAccount}
          onClose={() => setShowDeleteAccount(false)}
        />
      )}
    </div>
  );
}