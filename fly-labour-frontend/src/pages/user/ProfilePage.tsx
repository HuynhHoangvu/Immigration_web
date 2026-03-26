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
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

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
      toast.success("Đã cập nhật hồ sơ");
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const handleWithdraw = async (appId: string) => {
    if (!confirm('Bạn có chắc muốn rút đơn này không?')) return;
    try {
      await applicationsApi.withdraw(appId);
      setMyApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'withdrawn' as any } : a));
      toast.success('Đã rút đơn ứng tuyển');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Rút đơn thất bại');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.currentPassword || !passForm.newPassword || !passForm.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setChangingPass(true);
    try {
      await usersApi.changePassword(passForm);
      toast.success('Đổi mật khẩu thành công');
      setShowChangePass(false);
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đổi mật khẩu thất bại');
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
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-black text-3xl font-bold mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                }}
              >
                {user.fullName.charAt(0)}
              </div>
              <h2 className="font-semibold text-white">{user.fullName}</h2>
              <p className="text-brand-muted text-sm">{user.email}</p>
              <span
                className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  user.role === "admin"
                    ? "bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}
              >
                {user.role === "admin" ? "👑 Admin" : "👤 Thành viên"}
              </span>
              <div className="mt-4 pt-4 border-t border-brand-border text-xs text-brand-muted">
                Thành viên từ {formatDate(user.createdAt)}
              </div>
            </div>

            <div className="card-dark p-4 space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-gray-300">
                <Mail size={14} className="text-brand-yellow shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Phone size={14} className="text-brand-yellow shrink-0" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2.5 text-sm text-gray-300">
                  <MapPin size={14} className="text-brand-yellow shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
              >
                ⚙️ Vào Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>

          {/* Right */}
          <div className="md:col-span-2 space-y-5">
            {/* Edit profile */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <User size={16} className="text-brand-yellow" /> Thông tin cá
                  nhân
                </h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 text-xs text-brand-yellow hover:text-brand-orange transition-colors"
                  >
                    <Edit3 size={13} /> Chỉnh sửa
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
                    <X size={13} /> Hủy
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Họ và tên",
                    key: "fullName",
                    placeholder: "Nguyễn Văn A",
                  },
                  {
                    label: "Số điện thoại",
                    key: "phone",
                    placeholder: "0901 234 567",
                  },
                  {
                    label: "Địa chỉ",
                    key: "address",
                    placeholder: "Quận/Huyện, Tỉnh/TP",
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
                        {(user[f.key as keyof typeof user] as string) || "—"}
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
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Lưu thay đổi
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Change password */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Lock size={16} className="text-brand-yellow" /> Đổi mật khẩu
                </h3>
                <button
                  onClick={() => setShowChangePass(!showChangePass)}
                  className="text-xs text-brand-yellow hover:text-brand-orange transition-colors"
                >
                  {showChangePass ? 'Đóng' : 'Đổi mật khẩu'}
                </button>
              </div>
              {showChangePass && (
                <form onSubmit={handleChangePassword} className="space-y-3">
                  {[
                    { label: 'Mật khẩu hiện tại', key: 'currentPassword' },
                    { label: 'Mật khẩu mới', key: 'newPassword' },
                    { label: 'Xác nhận mật khẩu mới', key: 'confirmPassword' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs text-brand-muted mb-1.5 block">{f.label}</label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={passForm[f.key as keyof typeof passForm]}
                          onChange={e => setPassForm(p => ({ ...p, [f.key]: e.target.value }))}
                          className="input-dark pr-11"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={changingPass} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
                    {changingPass
                      ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Đang đổi...</>
                      : <><Save size={13} /> Đổi mật khẩu</>
                    }
                  </button>
                </form>
              )}
            </div>

            {/* My applications */}
            <div className="card-dark p-6">
              <h3 className="font-semibold text-white mb-4">
                📋 Đơn ứng tuyển của tôi
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
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-brand-muted text-sm">
                    Bạn chưa có đơn ứng tuyển nào
                  </p>
                  <Link
                    to="/jobs"
                    className="inline-block mt-3 btn-primary text-sm px-5 py-2"
                  >
                    Tìm việc ngay
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
                          {app.job?.company} · {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-medium ${APP_STATUS_LABELS[app.status]?.color}`}
                      >
                        {APP_STATUS_LABELS[app.status]?.label}
                      </span>
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          title="Rút đơn"
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
