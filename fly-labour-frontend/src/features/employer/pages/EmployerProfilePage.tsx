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
  Camera,
} from "lucide-react";
import { usersApi, uploadApi, getImageUrl } from "@core/services/api";
import { useAuthStore } from "@core/store/authStore";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./EmployerProfilePage.module.scss";

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  return (
    <div className={clsx(s.page, "fl-max-3xl")}>
      <div>
        <h1 className={s.headTitle}>
          Hồ sơ Doanh nghiệp
        </h1>
        <p className={s.headSub}>
          Cập nhật thông tin công ty để thu hút ứng viên chất lượng hơn.
        </p>
      </div>

      <div className={clsx(s.card, s.page)}>
        <div className={s.sectionTitleRow}>
          <Building2 size={18} className={s.iconAmber} />
          <h2 className={s.sectionTitle}>
            Thông tin công ty
          </h2>
        </div>

        <div className={s.profileHead}>
          <div className={s.avatarWrap}>
            {user?.avatar ? (
              <img
                src={getImageUrl(user.avatar)}
                alt=""
                className={s.avatarImage}
              />
            ) : (
              <div
                className={s.avatarFallback}
                style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
              >
                {(info.companyName || info.fullName || "C").charAt(0).toUpperCase()}
              </div>
            )}
            <label className={s.avatarUpload}>
              {uploadingAvatar ? (
                <div className={clsx(s.spinSm, "animate-spin")} />
              ) : (
                <Camera size={14} />
              )}
              <input
                type="file"
                accept="image/*"
                className={s.hiddenInput}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setUploadingAvatar(true);
                  try {
                    const { url } = await uploadApi.image(file);
                    const res = await usersApi.updateMe({ avatar: url });
                    setUser(res.data);
                    toast.success("Đã cập nhật ảnh đại diện");
                  } catch {
                    toast.error("Tải ảnh đại diện thất bại");
                  } finally {
                    setUploadingAvatar(false);
                  }
                }}
              />
            </label>
          </div>
          <div className={s.minW0}>
            <p className={s.companyName}>
              {info.companyName || "Tên doanh nghiệp"}
            </p>
            <p className={s.companyEmail}>
              <Mail size={14} className={s.mailIcon} />{" "}
              {user?.email}
            </p>
          </div>
        </div>

        <div className={s.formGrid}>
          <div className={s.field}>
            <label className={s.label}>
              <User size={13} /> Người đại diện *
            </label>
            <input
              value={info.fullName}
              onChange={fi("fullName")}
              className={s.input}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className={s.field}>
            <label className={s.label}>
              <Phone size={13} /> Số điện thoại
            </label>
            <input
              value={info.phone}
              onChange={fi("phone")}
              className={s.input}
              placeholder="0901 234 567"
            />
          </div>
          <div className={clsx(s.field, s.span2)}>
            <label className={s.label}>
              <Building2 size={13} /> Tên chính thức công ty *
            </label>
            <input
              value={info.companyName}
              onChange={fi("companyName")}
              className={s.input}
              placeholder="Công ty TNHH Giải pháp Nhân sự"
            />
          </div>
          <div className={clsx(s.field, s.span2)}>
            <label className={s.label}>
              <Globe size={13} /> Địa chỉ Website
            </label>
            <input
              value={info.website}
              onChange={fi("website")}
              className={s.input}
              placeholder="https://company.com"
            />
          </div>
          <div className={clsx(s.field, s.span2)}>
            <label className={s.labelBlock}>
              Giới thiệu về doanh nghiệp
            </label>
            <textarea
              value={info.companyDescription}
              onChange={fi("companyDescription")}
              rows={5}
              className={s.textarea}
              placeholder="Chia sẻ về lĩnh vực hoạt động, văn hóa công ty để ứng viên tin tưởng hơn..."
            />
          </div>
        </div>

        <div className={s.saveRow}>
          <button
            onClick={handleSaveInfo}
            disabled={savingInfo}
            className={clsx("btn-primary", s.saveBtn)}
          >
            {savingInfo ? (
              <>
                <div className={clsx(s.spinDark, s.spin)} />{" "}
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

      <div className={s.card}>
        <div className={s.sectionTitleRow}>
          <CheckCircle size={18} className={s.iconGreen} />
          <h2 className={s.sectionTitle}>
            Tài khoản & Trạng thái
          </h2>
        </div>
        <div className={s.statusList}>
          <div className={s.statusRow}>
            <span className={s.statusKey}>
              Email đăng nhập
            </span>
            <span className={s.statusValue}>
              {user?.email}
            </span>
          </div>
          <div className={s.statusRow}>
            <span className={s.statusKey}>
              Loại tài khoản
            </span>
            <span className={s.roleValue}>
              Nhà tuyển dụng
            </span>
          </div>
          <div className={s.statusRow}>
            <span className={s.statusKey}>
              Trạng thái hệ thống
            </span>
            <span className={s.onlineValue}>
              <span className={clsx(s.onlineDot, "animate-pulse")} />{" "}
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      <div className={clsx(s.card, s.page)}>
        <div className={s.sectionTitleRow}>
          <Lock size={18} className={s.iconAmber} />
          <h2 className={s.sectionTitle}>
            Bảo mật & Mật khẩu
          </h2>
        </div>

        <div className={s.passwordGrid}>
          {[
            { key: "currentPassword", label: "Mật khẩu hiện tại" },
            { key: "newPassword", label: "Mật khẩu mới (tối thiểu 8 ký tự)" },
            { key: "confirmPassword", label: "Xác nhận lại mật khẩu mới" },
          ].map((f) => (
            <div key={f.key} className={s.field}>
              <label className={s.labelBlock}>
                {f.label}
              </label>
              <div className={s.passwordInputWrap}>
                <input
                  type={showPw ? "text" : "password"}
                  value={pw[f.key as keyof typeof pw]}
                  onChange={fp(f.key)}
                  className={clsx(s.input, s.passwordInput)}
                  placeholder="••••••••"
                />
                {f.key === "currentPassword" && (
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className={s.togglePw}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={s.saveRow}>
          <button
            onClick={handleChangePw}
            disabled={savingPw}
            className={s.passwordSave}
          >
            {savingPw ? (
              <>
                <div className={clsx(s.spinSlate, s.spin)} />{" "}
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
