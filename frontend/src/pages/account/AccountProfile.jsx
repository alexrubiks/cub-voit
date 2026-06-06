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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
        setError(JSON.stringify(data));
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

  const avatarUrl = user?.avatar || null;
  const initials = user?.pseudo?.[0] ?? "";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Informations personnelles</h1>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg"
          >
            <Pencil size={13} /> Modifier
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <X size={16} className="text-gray-500" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm text-white bg-indigo-600 px-3 py-1.5 rounded-lg disabled:opacity-50"
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
            className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-medium overflow-hidden cursor-pointer relative group"
            onClick={() => fileInputRef.current.click()}
          >
            {avatarUrl
              ? <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
              : initials
            }
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Appuie pour changer la photo</p>
        </div>

        {/* Profil */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-1">Profil</p>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

            {/* ID */}
            <div className="flex items-center px-4 py-3 border-b border-gray-50">
              <span className="text-sm text-gray-400 w-24 flex-shrink-0">Identifiant</span>
              <span className="flex-1 text-sm text-gray-300">{user?.username}</span>
            </div>

            {[
              { label: "Pseudo", field: "pseudo" },
              { label: "Email", field: "email", type: "email" },
            ].map(({ label, field, type = "text" }) => (
              <div key={field} className="flex items-center px-4 py-3 border-b border-gray-50">
                <span className="text-sm text-gray-400 w-24 flex-shrink-0">{label}</span>
                {editing ? (
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="flex-1 text-sm text-gray-900 focus:outline-none bg-transparent border-b border-indigo-300 pb-0.5"
                  />
                ) : (
                  <span className="flex-1 text-sm text-gray-900">
                    {user?.[field] || <span className="text-gray-400">—</span>}
                  </span>
                )}
              </div>
            ))}

            {/* WCA ID */}
            <div className="flex items-center px-4 py-3">
              <span className="text-sm text-gray-400 w-24 flex-shrink-0">WCA ID</span>
              {user?.wca_id ? (
                <>
                  <span className="flex-1 text-sm text-gray-900">{user.wca_id}</span>
                  <button
                    onClick={async () => {
                      await fetch(API_URLS.disconnectWca, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                      });
                      setUser((prev) => ({ ...prev, wca_id: null }));
                    }}
                    className="text-xs text-gray-300 hover:text-red-400 transition"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    window.location.href = `http://localhost:8000/auth/wca/login/?token=${token}`;
                  }}
                  className="flex-1 flex items-center justify-center gap-2 text-sm text-indigo-500 hover:text-indigo-700 transition"
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
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 px-1">Domicile</p>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            {editing ? (
              <button
                onClick={() => setShowMap(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 transition"
              >
                <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                <span className={`text-sm ${form.location_name ? "text-gray-900" : "text-gray-400"}`}>
                  {form.location_name || "Choisir sur la carte..."}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-gray-900">
                  {user?.location_name || <span className="text-gray-400">Non défini</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <p className="text-xs text-red-400 px-1">{error}</p>
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