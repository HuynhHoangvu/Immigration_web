import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Briefcase, User } from "lucide-react";
import { useAuthStore } from "@/core/store/authStore";
import { useT } from "@/core/hooks/useT";
import toast from "react-hot-toast";

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
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Registration failed";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputClasses =
    "w-full h-12 text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold focus:ring-1 focus:ring-amber-400 dark:focus:ring-brand-gold outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative bg-slate-50 dark:bg-transparent transition-colors duration-300">
      {/* Background Decor - Only show dark gradient in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/20 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark" />
      <div
        className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
      />

      <div className="relative w-full max-w-lg">
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
            {a.registerTitle}
          </h1>
          <p className="text-slate-700 dark:text-gray-300 text-sm mt-1.5">
            {a.registerSub}
          </p>
        </div>

        <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-10 transition-colors">
          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                accountType === "user"
                  ? "border-amber-500 bg-amber-50 dark:border-brand-gold dark:bg-brand-gold/10 text-amber-700 dark:text-brand-gold shadow-md"
                  : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-brand-muted hover:border-amber-200 dark:hover:border-brand-gold/30"
              }`}
            >
              <User
                size={24}
                className={accountType === "user" ? "animate-bounce" : ""}
              />
              <div className="text-center">
                <p className="text-sm font-bold">{a.jobSeeker}</p>
                <p className="text-xs font-medium opacity-70">
                  {a.jobSeekerSub}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("employer")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                accountType === "employer"
                  ? "border-amber-500 bg-amber-50 dark:border-brand-gold dark:bg-brand-gold/10 text-amber-700 dark:text-brand-gold shadow-md"
                  : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-brand-muted hover:border-amber-200 dark:hover:border-brand-gold/30"
              }`}
            >
              <Briefcase
                size={24}
                className={accountType === "employer" ? "animate-bounce" : ""}
              />
              <div className="text-center">
                <p className="text-sm font-bold">{a.employer}</p>
                <p className="text-xs font-medium opacity-70">
                  {a.employerSub}
                </p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {a.fullName} *
                </label>
                <input
                  value={form.fullName}
                  onChange={setField("fullName")}
                  className={inputClasses}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {a.email} *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  className={inputClasses}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {a.phone} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                  className={inputClasses}
                  placeholder="0901 234 567"
                />
              </div>

              {accountType === "employer" ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                      {a.companyName} *
                    </label>
                    <input
                      value={form.companyName}
                      onChange={setField("companyName")}
                      className={inputClasses}
                      placeholder="ABC Company Ltd."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                      {a.website}
                    </label>
                    <input
                      value={form.website}
                      onChange={setField("website")}
                      className={inputClasses}
                      placeholder="https://yourcompany.com"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                    {a.address}
                  </label>
                  <input
                    value={form.address}
                    onChange={setField("address")}
                    className={inputClasses}
                    placeholder="City / Province"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {a.password} *
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={setField("password")}
                    className={`${inputClasses} pr-12`}
                    placeholder={a.minPass}
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
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-gray-100 mb-1.5 block">
                  {a.confirmPass} *
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={setField("confirm")}
                  className={inputClasses}
                  placeholder={a.reEnterPass}
                />
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
              {a.termsText}{" "}
              <Link
                to="/"
                className="text-amber-600 dark:text-brand-gold font-bold hover:underline"
              >
                {a.termsLink}
              </Link>{" "}
              {a.and}{" "}
              <Link
                to="/"
                className="text-amber-600 dark:text-brand-gold font-bold hover:underline"
              >
                {a.privacyLink}
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                  {a.creating}
                </>
              ) : (
                <>
                  <UserPlus size={18} /> {a.createBtn}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-700 dark:text-gray-300 mt-8">
            {a.hasAccount}{" "}
            <Link
              to="/login"
              className="text-amber-600 dark:text-brand-gold hover:text-amber-700 dark:hover:text-brand-orange transition-colors font-bold"
            >
              {a.signInLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
