import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@core/store/authStore";
import { useT } from "@core/hooks/useT";
import toast from "react-hot-toast";
import s from "./LoginPage.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { t } = useT();
  const a = t("auth");
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(a.loginFail);
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success(a.welcome);
      if (from === "/") {
        const role = useAuthStore.getState().user?.role;
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "employer") navigate("/employer", { replace: true });
        else navigate("/", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={s.bgDecor} />
      <div
        className={s.orb}
        style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
      />

      <div className={s.shell}>
        <div className={s.header}>
          <Link to="/" className={s.logoLink}>
            <div
              className={s.logoMark}
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              <span className={s.logoMarkLetter}>FL</span>
            </div>
            <span className={`font-display ${s.logoText}`}>
              FLY <span className={s.logoAccent}>LABOUR</span>
            </span>
          </Link>
          <h1 className={s.title}>{a.signInTitle}</h1>
          <p className={s.sub}>{a.signInSub}</p>
        </div>

        <div className={s.formCard}>
          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.field}>
              <label className={s.label} htmlFor="login-email">
                {a.email}
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={s.input}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="login-password">
                {a.password}
              </label>
              <div className={s.inputWrap}>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(s.input, s.inputTogglePad)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={s.togglePass}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={clsx("btn-primary", s.submitBtn)}
            >
              {loading ? (
                <>
                  <div className={s.spinner} /> {a.signingIn}
                </>
              ) : (
                <>
                  <LogIn size={18} /> {a.signInBtn}
                </>
              )}
            </button>
          </form>

          <p className={s.footer}>
            {a.noAccount}{" "}
            <Link to="/register" className={s.registerLink}>
              {a.registerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
