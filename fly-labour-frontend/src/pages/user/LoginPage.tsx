import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { t } = useT();
  const a = t('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error(a.loginFail); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success(a.welcome);
      // Redirect theo role n?u không có trang c? th? c?n quay l?i
      if (from === '/') {
        const role = useAuthStore.getState().user?.role
        if (role === 'admin')    navigate('/admin', { replace: true })
        else if (role === 'employer') navigate('/employer', { replace: true })
        else navigate('/', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-brand-dark to-brand-dark" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }} />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
              <span className="font-display text-lg text-slate-900 font-black">FL</span>
            </div>
            <span className="font-display text-2xl text-white tracking-wider">FLY <span style={{ color: "#fdd52f" }}>LABOUR</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{a.signInTitle}</h1>
          <p className="text-brand-muted text-sm mt-1">{a.signInSub}</p>
        </div>

        <div className="card-dark p-8">
          <div className="mb-5 p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl text-xs text-brand-muted">
            <p className="font-semibold text-brand-gold mb-1">{a.demoTitle}</p>
            <p>{a.adminLabel} <span className="text-white">admin@flylabour.com</span> / <span className="text-white">Admin@123</span></p>
            <p>{a.userLabel} <span className="text-white">user@example.com</span> / <span className="text-white">User@123</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-brand-muted mb-1.5 block">{a.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div>
              <label className="text-xs text-brand-muted mb-1.5 block">{a.password}</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark pr-11" placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> {a.signingIn}</>
                : <><LogIn size={16} /> {a.signInBtn}</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            {a.noAccount}{' '}
            <Link to="/register" className="text-brand-gold hover:text-brand-orange transition-colors font-medium">{a.registerLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
