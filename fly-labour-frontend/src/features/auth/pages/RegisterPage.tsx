import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Briefcase, User } from "lucide-react";
import { useAuthStore } from "@core/store/authStore";
import { useT } from "@core/hooks/useT";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./RegisterPage.module.scss";

type AccountType = "user" | "employer";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    address: "",
    companyName: "",
    website: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const { t } = useT();
  const a = t("auth");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error(a.required);
      return;
    }
    if (accountType === "employer" && !form.companyName) {
      toast.error(a.companyRequired);
      return;
    }
    if (form.password.length < 8) {
      toast.error(a.weakPass);
      return;
    }
    if (form.password !== form.confirm) {
      toast.error(a.passMismatch);
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        role: accountType,
        companyName: accountType === "employer" ? form.companyName : undefined,
        website: accountType === "employer" ? form.website : undefined,
      });
      toast.success(a.success);
      navigate(accountType === "employer" ? "/employer" : "/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message || "Registration failed";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className={s.page}>
      <div className={s.bgGrad} />
      <div
        className={s.blob}
        style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
      />

      <div className={s.inner}>
        <div className={s.header}>
          <Link to="/" className={s.logoLink}>
            <div
              className={s.logoMark}
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              <span className={s.logoLetter}>FL</span>
            </div>
            <span className={s.brandName}>
              FLY <span className={s.brandAccent}>LABOUR</span>
            </span>
          </Link>
          <h1 className={s.title}>{a.registerTitle}</h1>
          <p className={s.sub}>{a.registerSub}</p>
        </div>

        <div className={s.card}>
          <div className={s.typeGrid}>
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={clsx(
                s.typeBtn,
                accountType === "user" ? s.typeBtnActive : s.typeBtnIdle,
              )}
            >
              <User
                size={24}
                className={accountType === "user" ? s.iconBounce : undefined}
              />
              <div className={s.typeTextCenter}>
                <p className={s.typeTitle}>{a.jobSeeker}</p>
                <p className={s.typeSub}>{a.jobSeekerSub}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("employer")}
              className={clsx(
                s.typeBtn,
                accountType === "employer" ? s.typeBtnActive : s.typeBtnIdle,
              )}
            >
              <Briefcase
                size={24}
                className={
                  accountType === "employer" ? s.iconBounce : undefined
                }
              />
              <div className={s.typeTextCenter}>
                <p className={s.typeTitle}>{a.employer}</p>
                <p className={s.typeSub}>{a.employerSub}</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.fieldGrid}>
              <div className={s.colSpan2}>
                <label className={s.label}>{a.fullName} *</label>
                <input
                  value={form.fullName}
                  onChange={setField("fullName")}
                  className={s.input}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className={s.label}>{a.email} *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  className={s.input}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className={s.label}>{a.phone} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  className={s.input}
                  placeholder="0901 234 567"
                />
              </div>

              {accountType === "employer" ? (
                <>
                  <div>
                    <label className={s.label}>{a.companyName} *</label>
                    <input
                      value={form.companyName}
                      onChange={setField("companyName")}
                      className={s.input}
                      placeholder="ABC Company Ltd."
                    />
                  </div>
                  <div>
                    <label className={s.label}>{a.website}</label>
                    <input
                      value={form.website}
                      onChange={setField("website")}
                      className={s.input}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </>
              ) : (
                <div className={s.colSpan2}>
                  <label className={s.label}>{a.address}</label>
                  <input
                    value={form.address}
                    onChange={setField("address")}
                    className={s.input}
                    placeholder="City / Province"
                  />
                </div>
              )}

              <div>
                <label className={s.label}>{a.password} *</label>
                <div className={s.passWrap}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={setField("password")}
                    className={clsx(s.input, s.inputPass)}
                    placeholder={a.minPass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className={s.toggleEye}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={s.label}>{a.confirmPass} *</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                  className={s.input}
                  placeholder={a.reEnterPass}
                />
              </div>
            </div>

            <p className={s.terms}>
              {a.termsText}{" "}
              <Link to="/" className={s.termsLink}>
                {a.termsLink}
              </Link>{" "}
              {a.and}{" "}
              <Link to="/" className={s.termsLink}>
                {a.privacyLink}
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className={clsx("btn-primary", s.submitBtn)}
            >
              {loading ? (
                <>
                  <span className={s.spinner} /> {a.creating}
                </>
              ) : (
                <>
                  <UserPlus size={18} /> {a.createBtn}
                </>
              )}
            </button>
          </form>

          <p className={s.footer}>
            {a.hasAccount}{" "}
            <Link to="/login" className={s.signInLink}>
              {a.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
