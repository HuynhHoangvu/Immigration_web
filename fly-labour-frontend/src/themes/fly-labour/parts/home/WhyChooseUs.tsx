import { Shield, Globe, Clock, HeartHandshake } from "lucide-react";
import { useT } from "@/core/hooks/useT";

const FEATURE_ICONS = [
  <Shield size={24} />,
  <Globe size={24} />,
  <Clock size={24} />,
  <HeartHandshake size={24} />,
];

export default function WhyChooseUs() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className="py-20 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 dark:via-brand-gold/[0.02] to-transparent transition-colors duration-500" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {h.statsValues.map((val: string, i: number) => (
            <div
              key={i}
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none p-6 text-center group hover:border-amber-400 dark:hover:border-brand-gold/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <img
                  src={`/dashboar_img/${i + 1}.png`}
                  alt=""
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className="font-display text-4xl gradient-text mb-1">{val}</p>
              <p className="text-slate-600 dark:text-brand-muted text-sm font-medium transition-colors">
                {h.statsLabels[i]}
              </p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-sm font-bold uppercase tracking-widest mb-3 transition-colors">
              {h.whyBadge}
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5 transition-colors">
              {h.whyTitle}
              <br />
              <span className="gradient-text">{h.whyTitleAccent}</span>{" "}
              {h.whySubtitle}
            </h2>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-8 transition-colors">
              {h.whyDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/jobs" className="btn-primary text-sm px-6 py-2.5 font-medium shadow-md">
                {h.findJob}
              </a>
              <a
                href="/contact"
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium"
              >
                {h.freeConsult}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {h.featureTitles.map((title: string, i: number) => (
              <div
                key={i}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none p-5 group hover:border-amber-400 dark:hover:border-brand-gold/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 flex items-center justify-center text-amber-600 dark:text-brand-gold mb-4 group-hover:bg-amber-100 dark:group-hover:bg-brand-gold/20 transition-colors shadow-sm dark:shadow-none">
                  {FEATURE_ICONS[i]}
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 transition-colors">
                  {title}
                </h4>
                <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed transition-colors">
                  {h.featureDescs[i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
