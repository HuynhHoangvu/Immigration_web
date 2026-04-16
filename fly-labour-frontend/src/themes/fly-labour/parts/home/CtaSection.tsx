import { Link } from "react-router-dom";
import { useT } from "@/core/hooks/useT";

export default function CtaSection() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-12 relative overflow-hidden transition-colors">
            {/* Gradient nền thay đổi linh hoạt theo Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100/40 dark:from-brand-gold/5 dark:via-transparent dark:to-brand-orange/5 transition-colors duration-500" />

            <div className="relative">
              <p className="text-amber-600 dark:text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">
                {h.ctaBadge}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-wide mb-4 transition-colors">
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className="text-slate-600 dark:text-brand-muted mb-8 max-w-lg mx-auto leading-relaxed transition-colors">
                {h.ctaDesc}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link
                  to="/register"
                  className="btn-primary px-8 py-3 font-medium"
                >
                  {h.ctaRegister}
                </Link>
                {/* Thay btn-outline bằng class linh hoạt Light/Dark */}
                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium"
                >
                  {h.ctaConsult}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
