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
import { useAuthStore } from "@core/store/authStore";
import { applicationsApi, usersApi } from "@core/services/api";
import type { Application } from "@core/types";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./ProfilePage.module.scss";

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
    if (!confirm("Bạn có chắc muốn rút đơn này không?")) return;
    try {
      await applicationsApi.withdraw(appId);
      setMyApps((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: "withdrawn" as any } : a,
        ),
      );
      toast.success("Đã rút đơn ứng tuyển");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Rút đơn thất bại");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !passForm.currentPassword ||
      !passForm.newPassword ||
      !passForm.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setChangingPass(true);
    try {
      await usersApi.changePassword(passForm);
      toast.success("Đổi mật khẩu thành công");
      setShowChangePass(false);
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPass(false);
    }
  };

  const cardClasses = s.card;
  const inputClasses = s.input;

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-container-4xl ${s.container}`}>
        <div className={s.layout}>
          <div className={s.leftCol}>
            <div className={`${cardClasses} ${s.p6} ${s.textCenter}`}>
              <div
                className={s.avatar}
                style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
              >
                {user.fullName.charAt(0)}
              </div>
              <h2 className={s.name}>{user.fullName}</h2>
              <p className={s.email}>{user.email}</p>
              <span
                className={clsx(
                  s.roleBadge,
                  user.role === "admin" ? s.roleAdmin : s.roleUser,
                )}
              >
                {user.role === "admin" ? "👑 Admin" : "🙋 Thành viên"}
              </span>
              <div className={s.memberSince}>Thành viên từ {formatDate(user.createdAt)}</div>
            </div>

            <div className={`${cardClasses} ${s.p4} ${s.contactList}`}>
              <div className={s.contactItem}>
                <Mail size={14} className={s.contactIcon} />
                <span className={s.truncate}>{user.email}</span>
              </div>
              {user.phone && (
                <div className={s.contactItem}>
                  <Phone size={14} className={s.contactIcon} />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className={s.contactItem}>
                  <MapPin size={14} className={s.contactIcon} />
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            {user.role === "admin" && (
              <Link to="/admin" className={clsx("btn-primary", s.adminBtn)}>
                🚀 Vào Admin Dashboard
              </Link>
            )}

            <button onClick={handleLogout} className={s.logoutBtn}>
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>

          <div className={s.rightCol}>
            <div className={`${cardClasses} ${s.p6}`}>
              <div className={s.sectionHead}>
                <h3 className={s.sectionTitle}>
                  <User size={16} className={s.titleIcon} /> Thông tin cá nhân
                </h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className={s.linkBtn}>
                    <Edit3 size={14} /> Chỉnh sửa
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
                    className={clsx(s.linkBtn, s.linkBtnDanger)}
                  >
                    <X size={14} /> Hủy
                  </button>
                )}
              </div>

              <div className={s.formStack}>
                {[
                  { label: "Họ và tên", key: "fullName", placeholder: "Nguyễn Văn A" },
                  { label: "Số điện thoại", key: "phone", placeholder: "0901 234 567" },
                  { label: "Địa chỉ", key: "address", placeholder: "Quận/Huyện, Tỉnh/TP" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className={s.label}>{f.label}</label>
                    {editing ? (
                      <input
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => setForm((fm) => ({ ...fm, [f.key]: e.target.value }))}
                        className={inputClasses}
                        placeholder={f.placeholder}
                      />
                    ) : (
                      <p className={s.valueBlock}>
                        {(user[f.key as keyof typeof user] as string) || "—"}
                      </p>
                    )}
                  </div>
                ))}

                {editing && (
                  <button onClick={handleSave} disabled={saving} className={clsx("btn-primary", s.saveBtn)}>
                    {saving ? (
                      <>
                        <span className={clsx("animate-spin", s.spinnerMini)} /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save size={15} /> Lưu thay đổi
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className={`${cardClasses} ${s.p6}`}>
              <div className={s.sectionHead}>
                <h3 className={s.sectionTitle}>
                  <Lock size={16} className={s.titleIcon} /> Đổi mật khẩu
                </h3>
                <button onClick={() => setShowChangePass(!showChangePass)} className={s.linkBtn}>
                  {showChangePass ? "Đóng" : "Đổi mật khẩu"}
                </button>
              </div>
              {showChangePass && (
                <form onSubmit={handleChangePassword} className={s.passForm}>
                  {[
                    { label: "Mật khẩu hiện tại", key: "currentPassword" },
                    { label: "Mật khẩu mới", key: "newPassword" },
                    { label: "Xác nhận mật khẩu mới", key: "confirmPassword" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className={s.label}>{f.label}</label>
                      <div className={s.inputWrap}>
                        <input
                          type={showPass ? "text" : "password"}
                          value={passForm[f.key as keyof typeof passForm]}
                          onChange={(e) => setPassForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className={clsx(inputClasses, s.inputPad)}
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className={s.eyeBtn}>
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" disabled={changingPass} className={clsx("btn-primary", s.saveBtn)}>
                    {changingPass ? (
                      <>
                        <span className={clsx("animate-spin", s.spinnerMini)} /> Đang đổi...
                      </>
                    ) : (
                      <>
                        <Save size={15} /> Xác nhận đổi
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className={`${cardClasses} ${s.p6}`}>
              <h3 className={s.sectionTitleSemi}>📩 Đơn ứng tuyển của tôi</h3>

              {loadingApps ? (
                <div className={s.appsLoading}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={clsx("animate-pulse", s.appsSkeleton)} />
                  ))}
                </div>
              ) : myApps.length === 0 ? (
                <div className={s.emptyApps}>
                  <p className={s.emptyEmoji}>📦</p>
                  <p className={s.emptyText}>Bạn chưa có đơn ứng tuyển nào</p>
                  <Link to="/jobs" className={clsx("btn-primary", s.emptyBtn)}>
                    Tìm việc ngay
                  </Link>
                </div>
              ) : (
                <div className={s.appsList}>
                  {myApps.map((app) => (
                    <div key={app.id} className={s.appRow}>
                      <div className={s.appMain}>
                        <p className={clsx(s.appTitle, s.truncate)}>{app.job?.title}</p>
                        <p className={clsx(s.appSub, s.truncate)}>
                          {app.job?.company} — {formatDate(app.createdAt)}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium ${APP_STATUS_LABELS[app.status]?.color}`}>
                        {APP_STATUS_LABELS[app.status]?.label}
                      </span>
                      {app.status === "pending" && (
                        <button onClick={() => handleWithdraw(app.id)} title="Rút đơn" className={s.withdrawBtn}>
                          <XCircle size={18} />
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
