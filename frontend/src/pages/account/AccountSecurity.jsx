import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut, Trash2, Check, Eye, EyeOff } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { API_URLS } from "../../utils";

export default function AccountSecurity() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordStatus, setPasswordStatus] = useState(null);

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
    await fetch(API_URLS.logoutAll, { method: "POST", headers: authHeader });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  // ─── Suppression du compte ───────────────────────────────────────────
  const handleDeleteAccount = async () => {
    await fetch(API_URLS.deleteAccount, { method: "DELETE", headers: authHeader });
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/login");
  };

  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const passwordComplete = passwords.current && passwords.new && passwords.confirm;

  return (
    <div className="min-h-screen bg-bg-base">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <button
          onClick={() => navigate("/account")}
          className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center hover:bg-bg-raised transition"
        >
          <ChevronLeft size={18} className="text-text-muted" />
        </button>
        <h1 className="text-lg font-medium text-text-primary">Sécurité</h1>
      </div>

      <div className="px-4 space-y-5 pb-8">

        {/* Mot de passe */}
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3 px-1">Mot de passe</p>
          <div className="bg-bg-surface rounded-lg border border-border p-4 space-y-4">
            {[
              { key: "current", label: "Mot de passe actuel" },
              { key: "new",     label: "Nouveau mot de passe" },
              { key: "confirm", label: "Confirmer le nouveau" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-text-muted mb-1 block">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    value={passwords[key]}
                    onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary bg-bg-surface"
                  />
                  <button
                    onClick={() => toggleShow(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords[key]
                      ? <EyeOff size={15} className="text-text-muted" />
                      : <Eye    size={15} className="text-text-muted" />
                    }
                  </button>
                </div>
              </div>
            ))}

            {passwordStatus === "mismatch" && (
              <p className="text-xs text-danger-text">Les mots de passe ne correspondent pas</p>
            )}
            {passwordStatus === "error" && (
              <p className="text-xs text-danger-text">Mot de passe actuel incorrect</p>
            )}
            {passwordStatus === "saved" && (
              <p className="text-xs text-success-text flex items-center gap-1">
                <Check size={11} /> Mot de passe modifié
              </p>
            )}

            <button
              onClick={handlePasswordSave}
              disabled={!passwordComplete || passwordStatus === "saving"}
              className="w-full bg-primary text-primary-text rounded-lg py-2.5 text-sm font-medium hover:bg-primary-hover transition disabled:opacity-40"
            >
              {passwordStatus === "saving" ? "Sauvegarde..." : "Changer le mot de passe"}
            </button>
          </div>
        </div>

        {/* Actions compte */}
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3 px-1">Compte</p>
          <div className="bg-bg-surface rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setShowLogoutAll(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border hover:bg-bg-raised transition"
            >
              <span className="w-9 h-9 rounded-lg bg-warning-bg flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-warning-text" />
              </span>
              <div className="text-left">
                <p className="text-sm text-text-primary">Déconnecter tous les appareils</p>
                <p className="text-xs text-text-muted">Invalide toutes les sessions actives</p>
              </div>
            </button>
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-danger-bg transition"
            >
              <span className="w-9 h-9 rounded-lg bg-danger-bg flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} className="text-danger-text" />
              </span>
              <div className="text-left">
                <p className="text-sm text-danger-text">Supprimer mon compte</p>
                <p className="text-xs text-text-muted">Action irréversible</p>
              </div>
            </button>
          </div>
        </div>

      </div>

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