import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Save,
  X,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { applicationsApi, usersApi } from "@/services/api";
import type { Application } from "@/types";
import { APP_STATUS_LABELS, formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setUser, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [myApps, setMyApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    applicationsApi
      .getMy()
      .then((r) => setMyApps(r.data))
      .catch(() => {})
      .finally(() => setLoadingApps(false));
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersApi.updateMe(form);
      setUser({ ...user, ...res.data });
      setEditing(false);
      toast.success("�� c?p nh?t h? so");
    } catch {
      toast.error("C?p nh?t th?t b?i");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("�� dang xu?t");
    navigate("/");
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm("B?n c� ch?c mu?n r�t don n�y kh�ng?")) return;
    try {
      await applicationsApi.withdraw(appId);
      setMyApps((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: "withdrawn" as any } : a,
        ),
      );
      toast.success("�� r�t don ?ng tuy?n");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "R�t don th?t b?i");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !passForm.currentPassword ||
      !passForm.newPassword ||
      !passForm.confirmPassword
    ) {
      toast.error("Vui l�ng di?n d?y d? th�ng tin");
      return;
    }
    setChangingPass(true);
    try {
      await usersApi.changePassword(passForm);
      toast.success("�?i m?t kh?u th�nh c�ng");
      setShowChangePass(false);
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "�?i m?t kh?u th?t b?i");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Avatar & info */}
          <div className="space-y-4">
            <div className="card-dark p-6 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-slate-900 text-3xl font-bold mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                }}
              >
                {user.fullName.charAt(0)}
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {user.fullName}
              </h2>
              <p className="text-brand-muted text-sm">{user.email}</p>
              <span
                className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  user.role === "admin"
                    ? "bg-brand-gold/20 text-brand-gold border border-brand-gold/30"
                    : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-white/10"
                }`}
              >
                {user.role === "admin" ? "?? Admin" : "?? Th�nh vi�n"}
              </span>
              <div className="mt-4 pt-4 border-t border-brand-border text-xs text-brand-muted">
                Th�nh vi�n t? {formatDate(user.createdAt)}
              </div>
            </div>

            <div className="card-dark p-4 space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Mail size={14} className="text-brand-gold shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <Phone size={14} className="text-brand-gold shrink-0" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <MapPin size={14} className="text-brand-gold shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                ?? V�o Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} /> �ang xu?t
            </button>
          </div>

          {/* Right */}
          <div className="md:col-span-2 space-y-5">
            {/* Edit profile */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <User size={16} className="text-brand-gold" /> Th�ng tin c�
                  nh�n
                </h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-orange transition-colors"
                  >
                    <Edit3 size={13} /> Ch?nh s?a
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        fullName: user.fullName || "",
                        phone: user.phone || "",
                        address: user.address || "",
                      });
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X size={13} /> H?y
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "H? v� t�n",
                    key: "fullName",
                    placeholder: "Nguy?n Van A",
                  },
                  {
                    label: "S? di?n tho?i",
                    key: "phone",
                    placeholder: "0901 234 567",
                  },
                  {
                    label: "�?a ch?",
                    key: "address",
                    placeholder: "Qu?n/Huy?n, T?nh/TP",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-brand-muted mb-1.5 block">
                      {f.label}
                    </label>
                    {editing ? (
                      <input
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) =>
                          setForm((fm) => ({ ...fm, [f.key]: e.target.value }))
                        }
                        className="input-dark"
                        placeholder={f.placeholder}
                      />
                    ) : (
                      <p className="text-white text-sm py-3 px-4 bg-brand-dark rounded-xl">
                        {(user[f.key as keyof typeof user] as string) || "�"}
                      </p>
                    )}
                  </div>
                ))}

                {editing && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                        �ang luu...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Luu thay d?i
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Change password */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={16} className="text-brand-gold" /> �?i m?t kh?u
                </h3>
                <button
                  onClick={() => setShowChangePass(!showChangePass)}
                  className="text-xs text-brand-gold hover:text-brand-orange transition-colors"
                >
                  {showChangePass ? "��ng" : "�?i m?t kh?u"}
                </button>
              </div>
              {showChangePass && (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  {[
                    { label: "M?t kh?u hi?n t?i", key: "currentPassword" },
                    { label: "M?t kh?u m?i", key: "newPassword" },
                    { label: "X�c nh?n m?t kh?u m?i", key: "confirmPassword" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {f.label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          value={passForm[f.key as keyof typeof passForm]}
                          onChange={(e) =>
                            setPassForm((p) => ({
                              ...p,
                              [f.key]: e.target.value,
                            }))
                          }
                          className="input-dark pr-11"
                          placeholder="��������"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
                        >
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={changingPass}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
                  >
                    {changingPass ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                        �ang d?i...
                      </>
                    ) : (
                      <>
                        <Save size={13} /> �?i m?t kh?u
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* My applications */}
            <div className="card-dark p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                ?? �on ?ng tuy?n c?a t�i
              </h3>

              {loadingApps ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-brand-dark rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : myApps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">??</p>
                  <p className="text-brand-muted text-sm">
                    B?n chua c� don ?ng tuy?n n�o
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-block mt-3 btn-primary text-sm px-5 py-2"
                  >
                    T�m vi?c ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myApps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 p-4 bg-brand-dark rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {app.job?.title}
                        </p>
                        <p className="text-brand-muted text-xs">
                          {app.job?.company} � {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${APP_STATUS_LABELS[app.status]?.color}`}
                      >
                        {APP_STATUS_LABELS[app.status]?.label}
                      </span>
                      {app.status === "pending" && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          title="R�t don"
                          className="shrink-0 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
