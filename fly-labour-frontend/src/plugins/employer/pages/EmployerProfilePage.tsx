import { useState, useEffect } from "react";
import {
  Save,
  Building2,
  Globe,
  Phone,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { usersApi } from "@/core/services/api";
import { useAuthStore } from "@/core/store/authStore";
import toast from "react-hot-toast";

export default function EmployerProfilePage() {
  const { user, setUser } = useAuthStore();

  const [info, setInfo] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    website: user?.website || "",
  });
  const [savingInfo, setSavingInfo] = useState(false);

  const [pw, setPw] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (user) {
      setInfo({
        fullName: user.fullName || "",
        phone: user.phone || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleSaveInfo = async () => {
    if (!info.fullName.trim() || !info.companyName.trim()) {
      toast.error("Vui lòng điền họ tên và tên công ty");
      return;
    }
    setSavingInfo(true);
    try {
      const res = await usersApi.updateMe(info);
      setUser(res.data);
      toast.success("Đã lưu thông tin công ty");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lưu thất bại");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePw = async () => {
    if (!pw.currentPassword || !pw.newPassword || !pw.confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin mật khẩu");
      return;
    }
    if (pw.newPassword.length < 8) {
      toast.error("Mật khẩu mới tối thiểu 8 ký tự");
      return;
    }
    if (pw.newPassword !== pw.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    setSavingPw(true);
    try {
      await usersApi.changePassword(pw);
      toast.success("Đổi mật khẩu thành công");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setSavingPw(false);
    }
  };

  const fi =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInfo((prev) => ({ ...prev, [k]: e.target.value }));
  const fp = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw((prev) => ({ ...prev, [k]: e.target.value }));

  // Class dùng chung để đồng bộ UI
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-colors";
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold focus:ring-1 focus:ring-amber-400 dark:focus:ring-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 max-w-3xl transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Hồ sơ Doanh nghiệp
        </h1>
        <p className="text-slate-500 dark:text-gray-300 text-sm mt-1">
          Cập nhật thông tin công ty để thu hút ứng viên chất lượng hơn.
        </p>
      </div>

      {/* Company info card */}
      <div className={`${cardClasses} p-6 space-y-6`}>
        <div className="flex items-center gap-2 mb-1">
          <Building2
            size={18}
            className="text-amber-600 dark:text-brand-gold"
          />
          <h2 className="font-bold text-slate-900 dark:text-white">
            Thông tin công ty
          </h2>
        </div>

        {/* Profile Header */}
        <div className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-amber-900 font-black text-3xl shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {(info.companyName || info.fullName || "C").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-white font-bold text-lg truncate">
              {info.companyName || "Tên doanh nghiệp"}
            </p>
            <p className="text-slate-500 dark:text-gray-300 text-sm flex items-center gap-1.5 mt-1">
              <Mail size={14} className="text-amber-500 dark:text-brand-gold" />{" "}
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <User size={13} /> Người đại diện *
            </label>
            <input
              value={info.fullName}
              onChange={fi("fullName")}
              className={`${inputClasses} h-12`}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Phone size={13} /> Số điện thoại
            </label>
            <input
              value={info.phone}
              onChange={fi("phone")}
              className={`${inputClasses} h-12`}
              placeholder="0901 234 567"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={13} /> Tên chính thức công ty *
            </label>
            <input
              value={info.companyName}
              onChange={fi("companyName")}
              className={`${inputClasses} h-12`}
              placeholder="Công ty TNHH Giải pháp Nhân sự"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Globe size={13} /> Địa chỉ Website
            </label>
            <input
              value={info.website}
              onChange={fi("website")}
              className={`${inputClasses} h-12`}
              placeholder="https://company.com"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider block">
              Giới thiệu về doanh nghiệp
            </label>
            <textarea
              value={info.companyDescription}
              onChange={fi("companyDescription")}
              rows={5}
              className={`${inputClasses} py-3 resize-none`}
              placeholder="Chia sẻ về lĩnh vực hoạt động, văn hóa công ty để ứng viên tin tưởng hơn..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveInfo}
            disabled={savingInfo}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-sm font-bold shadow-lg shadow-amber-500/20"
          >
            {savingInfo ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} /> Cập nhật hồ sơ
              </>
            )}
          </button>
        </div>
      </div>

      {/* Account summary card */}
      <div className={`${cardClasses} p-6`}>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle size={18} className="text-green-500" />
          <h2 className="font-bold text-slate-900 dark:text-white">
            Tài khoản & Trạng thái
          </h2>
        </div>
        <div className="space-y-4 text-sm font-medium">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-300 uppercase text-xs tracking-widest font-bold">
              Email đăng nhập
            </span>
            <span className="text-slate-900 dark:text-white">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-gray-300 uppercase text-xs tracking-widest font-bold">
              Loại tài khoản
            </span>
            <span className="text-amber-600 dark:text-brand-gold font-bold">
              Nhà tuyển dụng
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-gray-300 uppercase text-xs tracking-widest font-bold">
              Trạng thái hệ thống
            </span>
            <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Change password card */}
      <div className={`${cardClasses} p-6 space-y-5`}>
        <div className="flex items-center gap-2 mb-1">
          <Lock size={18} className="text-amber-600 dark:text-brand-gold" />
          <h2 className="font-bold text-slate-900 dark:text-white">
            Bảo mật & Mật khẩu
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 pt-2">
          {[
            { key: "currentPassword", label: "Mật khẩu hiện tại" },
            { key: "newPassword", label: "Mật khẩu mới (tối thiểu 8 ký tự)" },
            { key: "confirmPassword", label: "Xác nhận lại mật khẩu mới" },
          ].map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase tracking-wider block">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw[f.key as keyof typeof pw]}
                  onChange={fp(f.key)}
                  className={`${inputClasses} h-12 pr-12`}
                  placeholder="••••••••"
                />
                {f.key === "currentPassword" && (
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleChangePw}
            disabled={savingPw}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
          >
            {savingPw ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />{" "}
                Đang cập nhật...
              </>
            ) : (
              <>
                <Lock size={16} /> Lưu mật khẩu mới
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
