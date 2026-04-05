import { Shield, Globe, Clock, HeartHandshake } from "lucide-react";
import { useT } from "@/hooks/useT";
import { EditableText } from "@/components/ui/EditableText";
import { usePageContent } from "@/hooks/usePageContent";

const FEATURE_ICONS = [
  <Shield size={24} />,
  <Globe size={24} />,
  <Clock size={24} />,
  <HeartHandshake size={24} />,
];

export default function WhyChooseUs() {
  const { t } = useT();
  const h = t("home");

  const whyBadge = usePageContent("why.badge", h.whyBadge);
  const whyTitle = usePageContent("why.title", h.whyTitle);
  const whyTitleAccent = usePageContent("why.titleAccent", h.whyTitleAccent);
  const whySubtitle = usePageContent("why.subtitle", h.whySubtitle);
  const whyDesc = usePageContent("why.desc", h.whyDesc);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-gold/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {h.statsValues.map((val: string, i: number) => (
            <div
              key={i}
              className="card-dark p-6 text-center group hover:border-brand-gold/30 transition-all duration-300"
            >
              <div className="text-4xl mb-2">{h.statsIcons[i]}</div>
              <p className="font-display text-4xl gradient-text mb-1">{val}</p>
              <p className="text-brand-muted text-sm">{h.statsLabels[i]}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-3">
              <EditableText settingKey="why.badge" defaultValue={whyBadge} />
            </p>
            <h2 className="section-title mb-5">
              <EditableText settingKey="why.title" defaultValue={whyTitle} />
              <br />
              <span className="gradient-text">
                <EditableText settingKey="why.titleAccent" defaultValue={whyTitleAccent} />
              </span>{" "}
              <EditableText settingKey="why.subtitle" defaultValue={whySubtitle} />
            </h2>
            <p className="text-slate-900 leading-relaxed mb-8">
              <EditableText settingKey="why.desc" defaultValue={whyDesc} multiline />
            </p>
            <div className="flex gap-3">
              <a href="/jobs" className="btn-primary text-sm">
                {h.findJob}
              </a>
              <a href="/contact" className="btn-outline text-sm">
                {h.freeConsult}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {h.featureTitles.map((title: string, i: number) => (
              <div
                key={i}
                className="card-dark p-5 group hover:border-brand-gold/30 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold/20 transition-colors">
                  {FEATURE_ICONS[i]}
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
                  {title}
                </h4>
                <p className="text-brand-muted text-xs leading-relaxed">
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
