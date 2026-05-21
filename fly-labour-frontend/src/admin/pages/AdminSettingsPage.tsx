import { useState, useEffect } from "react";
import {
  Save,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Shield,
  Settings,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { settingsApi, usersApi } from "@core/services/api";
import { useAuthStore } from "@core/store/authStore";
import clsx from "clsx";
import s from "./AdminSettingsPage.module.scss";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "general" | "contact" | "security" | "notification"
  >("general");
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [general, setGeneral] = useState({
    siteName: "Fly Labour",
    tagline: "Kết nối lao động Việt Nam với thế giới",
    hotline: "0333 318 882",
    email: "flyvisa@gmail.com",
    address: "219A, No Trang Long, Binh Thanh, Ho Chi Minh City",
    facebookUrl: "https://facebook.com/flylabour",
    zaloNumber: "0333318882",
    messengerUrl: "https://m.me/flylabour",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifs, setNotifs] = useState({
    newApplication: "true",
    newUser: "true",
    jobExpiring: "true",
    emailNotif: "false",
  });

  useEffect(() => {
    settingsApi
      .getAll()
      .then((r) => {
        const rs = r.data;
        if (Object.keys(rs).length > 0) {
          setGeneral(
            (prev) =>
              ({
                ...prev,
                ...Object.fromEntries(
                  Object.entries(rs).filter(([k]) => Object.keys(prev).includes(k)),
                ),
              }) as typeof general,
          );
          setNotifs(
            (prev) =>
              ({
                ...prev,
                ...Object.fromEntries(
                  Object.entries(rs).filter(([k]) => Object.keys(prev).includes(k)),
                ),
              }) as typeof notifs,
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (activeTab === "security") {
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      setSaving(true);
      try {
        await usersApi.changePassword(security);
        toast.success("Đổi mật khẩu thành công");
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    try {
      await settingsApi.save({ ...general, ...notifs });
      toast.success("Đã lưu cài đặt");
    } catch {
      toast.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: "general", label: "Tổng quan", icon: Globe },
    { id: "contact", label: "Thông tin liên hệ", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notification", label: "Cấu hình thông báo", icon: Bell },
  ] as const;

  if (loading) {
    return (
      <div className={s.loadingWrap}>
        <Loader2 size={32} className={clsx(s.loadingIcon, s.spin)} />
        <p className={s.loadingText}>Đang tải cấu hình...</p>
      </div>
    );
  }

  return (
    <div className={clsx(s.page, s.max)}>
      <div className={s.head}>
        <div className={s.headIcon}>
          <Settings size={24} />
        </div>
        <div>
          <h1 className={s.title}>Cài đặt hệ thống</h1>
          <p className={s.sub}>Quản lý thông tin và cấu hình vận hành website</p>
        </div>
      </div>

      <div className={clsx(s.tabs, "custom-scrollbar")}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={clsx(s.tab, activeTab === t.id ? s.tabActive : s.tabIdle)}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div className={s.card}>
        {activeTab === "general" && (
          <div className={clsx(s.section, s.fadeIn)}>
            <div className={s.sectionHead}>
              <Globe size={18} className={s.iconAmber} />
              <h3 className={s.sectionTitle}>Thông tin Website</h3>
            </div>
            <div className={s.gridGap}>
              {[
                { label: "Tên website", key: "siteName", placeholder: "Fly Labour" },
                { label: "Slogan / Tagline", key: "tagline", placeholder: "Kết nối lao động..." },
              ].map((f) => (
                <div key={f.key} className={s.field}>
                  <label className={s.label}>{f.label}</label>
                  <input
                    value={general[f.key as keyof typeof general]}
                    onChange={(e) => setGeneral((g) => ({ ...g, [f.key]: e.target.value }))}
                    className={s.input}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className={clsx(s.section, s.fadeIn)}>
            <div className={s.sectionHead}>
              <Bell size={18} className={s.iconAmber} />
              <h3 className={s.sectionTitle}>Thông tin liên hệ & Mạng xã hội</h3>
            </div>
            <div className={s.grid2}>
              {[
                { label: "Hotline hiển thị", key: "hotline", placeholder: "0901 234 567" },
                { label: "Email hệ thống", key: "email", placeholder: "info@flylabour.com" },
                { label: "Địa chỉ văn phòng", key: "address", placeholder: "123 Nguyễn Văn Linh...", colSpan: true },
                { label: "Facebook Page URL", key: "facebookUrl", placeholder: "https://facebook.com/..." },
                { label: "Zalo (số điện thoại)", key: "zaloNumber", placeholder: "0901234567" },
                { label: "Messenger URL", key: "messengerUrl", placeholder: "https://m.me/...", colSpan: true },
              ].map((f) => (
                <div key={f.key} className={clsx(s.field, f.colSpan && s.span2)}>
                  <label className={s.label}>{f.label}</label>
                  <input
                    value={general[f.key as keyof typeof general]}
                    onChange={(e) => setGeneral((g) => ({ ...g, [f.key]: e.target.value }))}
                    className={s.input}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className={clsx(s.section, s.fadeIn)}>
            <div className={s.sectionHead}>
              <Shield size={18} className={s.iconAmber} />
              <h3 className={s.sectionTitle}>Bảo mật tài khoản</h3>
            </div>
            <div className={s.gridGap}>
              {[
                { label: "Mật khẩu hiện tại", key: "currentPassword" },
                { label: "Mật khẩu mới", key: "newPassword" },
                { label: "Xác nhận mật khẩu mới", key: "confirmPassword" },
              ].map((f) => (
                <div key={f.key} className={s.field}>
                  <label className={s.label}>{f.label}</label>
                  <div className={s.passWrap}>
                    <input
                      type={showPass ? "text" : "password"}
                      value={security[f.key as keyof typeof security]}
                      onChange={(e) => setSecurity((v) => ({ ...v, [f.key]: e.target.value }))}
                      className={clsx(s.input, s.passInput)}
                      placeholder="••••••••"
                    />
                    {f.key === "currentPassword" && (
                      <button type="button" onClick={() => setShowPass(!showPass)} className={s.togglePass}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className={s.tip}>
                💡 <b>Mẹo:</b> Mật khẩu mạnh nên bao gồm ít nhất 8 ký tự, có cả chữ hoa,
                chữ thường và các ký số để bảo vệ tài khoản admin an toàn nhất.
              </div>
            </div>
          </div>
        )}

        {activeTab === "notification" && (
          <div className={clsx(s.section, s.fadeIn)}>
            <div className={s.sectionHead}>
              <Bell size={18} className={s.iconAmber} />
              <h3 className={s.sectionTitle}>Cài đặt thông báo hệ thống</h3>
            </div>
            <div className={s.gridGap}>
              {[
                { key: "newApplication", label: "Đơn ứng tuyển mới", desc: "Nhận thông báo Real-time khi có người nộp hồ sơ" },
                { key: "newUser", label: "Tài khoản đăng ký mới", desc: "Thông báo khi có ứng viên hoặc nhà tuyển dụng mới" },
                { key: "jobExpiring", label: "Tin tuyển dụng sắp hết hạn", desc: "Nhắc nhở 72 giờ trước khi tin đăng tự động đóng" },
                { key: "emailNotif", label: "Thông báo qua Email", desc: "Gửi báo cáo tổng hợp các hoạt động về email Admin" },
              ].map((item) => {
                const isOn = notifs[item.key as keyof typeof notifs] === "true";
                return (
                  <div key={item.key} className={s.notifRow}>
                    <div>
                      <p className={s.notifTitle}>{item.label}</p>
                      <p className={s.notifDesc}>{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs((n) => ({ ...n, [item.key]: isOn ? "false" : "true" }))}
                      className={clsx(s.switch, isOn ? s.switchOn : s.switchOff)}
                    >
                      <div className={clsx(s.switchThumb, isOn ? s.thumbOn : s.thumbOff)} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={s.actionRow}>
          <button onClick={handleSave} disabled={saving} className={clsx("btn-primary", s.saveBtn)}>
            {saving ? (
              <>
                <Loader2 size={18} className={s.spin} />
                Đang lưu dữ liệu...
              </>
            ) : (
              <>
                <Save size={18} /> Lưu tất cả thay đổi
              </>
            )}
          </button>
          <div className={s.spacer} />
        </div>
      </div>
    </div>
  );
}
