import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/core/store/authStore";
import { useT } from "@/core/hooks/useT";
import toast from "react-hot-toast";

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

  const inputClasses =
    "w-full h-12 text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold focus:ring-1 focus:ring-amber-400 dark:focus:ring-brand-gold outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative bg-slate-50 dark:bg-transparent transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/20 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              <span className="font-display text-lg text-amber-900 font-black">
                FL
              </span>
            </div>
            <span className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-wider">
              FLY{" "}
              <span className="text-amber-500 dark:text-brand-gold">
                LABOUR
              </span>
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {a.signInTitle}
          </h1>
          <p className="text-slate-700 dark:text-gray-300 text-sm mt-1.5">
            {a.signInSub}
          </p>
        </div>

        <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                {a.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                {a.password}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-12`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-500/20 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                  {a.signingIn}
                </>
              ) : (
                <>
                  <LogIn size={18} /> {a.signInBtn}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-700 dark:text-gray-300 mt-8 transition-colors">
            {a.noAccount}{" "}
            <Link
              to="/register"
              className="text-amber-600 dark:text-brand-gold hover:text-amber-700 dark:hover:text-brand-orange transition-colors font-bold uppercase text-xs tracking-wider"
            >
              {a.registerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
