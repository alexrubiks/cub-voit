import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Camera, Pencil, X, Check, MapPin, LogOut } from "lucide-react";
import { UserContext } from "../../context/UserContext";
import MapPickerModal from "../../components/ui/MapPickerModal";
import { API_URLS, normalizeUser } from "../../utils";
import wcaLogo from "../../assets/wca-logo.png";

export default function AccountProfile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    pseudo: user?.pseudo ?? "",
    email: user?.email ?? "",
    location_name: user?.location_name ?? "",
    location_latitude: user?.location_latitude ?? null,
    location_longitude: user?.location_longitude ?? null,
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleCancel = () => {
    setForm({
      pseudo: user?.pseudo ?? "",
      email: user?.email ?? "",
      location_name: user?.location_name ?? "",
      location_latitude: user?.location_latitude ?? null,
      location_longitude: user?.location_longitude ?? null,
    });
    setEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(API_URLS.updateMe, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(normalizeUser(data));
        setEditing(false);
      } else {
        setError(data.detail ?? "Une erreur est survenue");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch(API_URLS.uploadAvatar, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setUser(normalizeUser(data));
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-lg bg-bg-surface border border-border flex items-center justify-center hover:bg-bg-raised transition"
          >
            <ChevronLeft size={18} className="text-text-muted" />
          </button>
          <h1 className="text-lg font-medium text-text-primary">Informations personnelles</h1>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-primary bg-primary-subtle px-3 py-1.5 rounded-lg"
          >
            <Pencil size={13} /> Modifier
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-lg bg-bg-raised flex items-center justify-center hover:bg-bg-raised transition"
            >
              <X size={16} className="text-text-muted" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-primary-text bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
            >
              <Check size={13} /> {saving ? "..." : "Sauvegarder"}
            </button>
          </div>
        )}
      </div>

      <div className="px-4 space-y-5 pb-8">

        {/* Avatar */}
        <div className="flex flex-col items-center py-4">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleAvatarChange} />
          <div
            className="w-24 h-24 rounded-full bg-primary-subtle border-2 border-primary flex items-center justify-center text-primary text-2xl font-medium overflow-hidden cursor-pointer relative group"
            onClick={() => fileInputRef.current.click()}
          >
            {user?.avatar
              ? <img src={user.avatar} className="w-full h-full object-cover" alt="" />
              : user?.pseudo?.[0] ?? ""
            }
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">Appuie pour changer la photo</p>
        </div>

        {/* Profil */}
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3 px-1">Profil</p>
          <div className="bg-bg-surface rounded-lg border border-border overflow-hidden">

            {/* Identifiant — lecture seule */}
            <div className="flex items-center px-4 py-3 border-b border-border">
              <span className="text-sm text-text-muted w-24 flex-shrink-0">Identifiant</span>
              <span className="flex-1 text-sm text-text-disabled">{user?.username}</span>
            </div>

            {[
              { label: "Pseudo", field: "pseudo" },
              { label: "Email",  field: "email", type: "email" },
            ].map(({ label, field, type = "text" }) => (
              <div key={field} className="flex items-center px-4 py-3 border-b border-border">
                <span className="text-sm text-text-muted w-24 flex-shrink-0">{label}</span>
                {editing ? (
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="flex-1 text-sm text-text-primary focus:outline-none bg-transparent border-b border-primary pb-0.5"
                  />
                ) : (
                  <span className="flex-1 text-sm text-text-primary">
                    {user?.[field] || <span className="text-text-muted">—</span>}
                  </span>
                )}
              </div>
            ))}

            {/* WCA ID */}
            <div className="flex items-center px-4 py-3">
              <span className="text-sm text-text-muted w-24 flex-shrink-0">WCA ID</span>
              {user?.wca_id ? (
                <>
                  <span className="flex-1 text-sm text-text-primary">{user.wca_id}</span>
                  <button
                    onClick={async () => {
                      await fetch(API_URLS.disconnectWca, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                      });
                      setUser((prev) => ({ ...prev, wca_id: null }));
                    }}
                    className="text-text-disabled hover:text-danger-text transition"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    window.location.href = `https://api.cubvoit.alexrubiks.fr/auth/wca/login/?token=${token}`;
                  }}
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-hover transition"
                >
                  <img src={wcaLogo} className="w-4 h-4" alt="WCA" />
                  Se connecter avec la WCA
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Domicile */}
        <div>
          <p className="text-xs uppercase tracking-widest text-text-muted mb-3 px-1">Domicile</p>
          <div className="bg-bg-surface rounded-lg border border-border p-4">
            {editing ? (
              <button
                onClick={() => setShowMap(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-bg-base border border-border rounded-lg hover:border-primary transition"
              >
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className={`text-sm ${form.location_name ? "text-text-primary" : "text-text-muted"}`}>
                  {form.location_name || "Choisir sur la carte..."}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm text-text-primary">
                  {user?.location_name || <span className="text-text-muted">Non défini</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-danger-text px-1">{error}</p>
        )}

      </div>

      {showMap && (
        <MapPickerModal
          initialLat={form.location_latitude}
          initialLng={form.location_longitude}
          onClose={() => setShowMap(false)}
          onConfirm={({ start_location_name, start_latitude, start_longitude }) => {
            handleChange("location_name", start_location_name);
            handleChange("location_latitude", start_latitude);
            handleChange("location_longitude", start_longitude);
          }}
        />
      )}
    </div>
  );
}