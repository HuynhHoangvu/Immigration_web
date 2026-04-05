import { Link } from "react-router-dom";
import { useT } from "@/hooks/useT";

export default function CtaSection() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="card-dark p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-orange/5" />
          <div className="relative">
            <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-3">
              {h.ctaBadge}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-amber-600 tracking-wide mb-4">
              {h.ctaTitle}
              <br />
              <span className="gradient-text">{h.ctaTitleAccent}</span>
            </h2>
            <p className="text-slate-900 dark:text-gray-100 mb-8 max-w-lg mx-auto">
              {h.ctaDesc}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary px-8 py-3">
                {h.ctaRegister}
              </Link>
              <Link to="/contact" className="btn-outline px-8 py-3">
                {h.ctaConsult}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
