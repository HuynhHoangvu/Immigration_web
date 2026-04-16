import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Briefcase, LogIn } from "lucide-react";
import { useT } from "@/core/hooks/useT";

export default function EmployerCTASection() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className="py-16 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-brand-border bg-white dark:bg-brand-card shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100/40 dark:from-brand-gold/5 dark:via-transparent dark:to-brand-orange/8 pointer-events-none transition-colors duration-500" />
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: content */}
            <div className="p-10 lg:p-14">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100 border border-amber-200 dark:text-brand-gold dark:bg-brand-gold/10 dark:border-brand-gold/30 rounded-full px-4 py-1.5 mb-6 transition-colors">
                <Briefcase size={12} /> {h.empBadge}
              </span>

              <h2 className="font-display text-4xl md:text-5xl text-slate-900 dark:text-white tracking-wide leading-tight mb-4 transition-colors">
                {h.empTitle}
                <br />
                <span className="text-amber-600 dark:text-brand-gold">{h.empTitleAccent}</span>
              </h2>

              <p className="text-slate-600 dark:text-brand-muted mb-8 max-w-md leading-relaxed transition-colors">
                {h.empDesc}
              </p>

              <ul className="space-y-3 mb-10">
                {h.empFeatures.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-gray-300 text-sm transition-colors">
                    <CheckCircle size={17} className="text-amber-500 dark:text-brand-gold flex-shrink-0 mt-0.5 transition-colors" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary px-7 py-3 flex items-center gap-2 text-sm font-semibold">
                  <Briefcase size={15} /> {h.empRegister} <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  className="px-7 py-3 flex items-center gap-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <LogIn size={15} /> {h.empLogin}
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div className="flex items-center justify-center p-10 lg:p-14 bg-slate-50 dark:bg-[#1a1a1a]/50 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-brand-border transition-colors">
              <div className="grid grid-cols-1 gap-8 w-full max-w-xs">
                {h.empStats.map((val: string, i: number) => (
                  <div key={i} className="text-center">
                    <p className="font-display text-5xl gradient-text mb-1">{val}</p>
                    <p className="text-slate-500 dark:text-brand-muted text-sm transition-colors">
                      {h.empStatsLabels[i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
