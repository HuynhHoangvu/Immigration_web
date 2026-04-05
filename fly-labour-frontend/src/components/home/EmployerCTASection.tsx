import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Briefcase, LogIn } from "lucide-react";
import { useT } from "@/hooks/useT";
import { EditableText } from "@/components/ui/EditableText";
import { usePageContent } from "@/hooks/usePageContent";

export default function EmployerCTASection() {
  const { t } = useT();
  const h = t("home");

  const empBadge = usePageContent("emp.badge", h.empBadge);
  const empTitle = usePageContent("emp.title", h.empTitle);
  const empTitleAccent = usePageContent("emp.titleAccent", h.empTitleAccent);
  const empDesc = usePageContent("emp.desc", h.empDesc);

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-brand-border bg-brand-card">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-orange/8 pointer-events-none" />
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: content */}
            <div className="p-10 lg:p-14">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 mb-6">
                <Briefcase size={12} /> <EditableText settingKey="emp.badge" defaultValue={empBadge} />
              </span>

              <h2 className="font-display text-4xl md:text-5xl text-brand-yellow tracking-wide leading-tight mb-4">
                <EditableText settingKey="emp.title" defaultValue={empTitle} />
                <br />
                <span className="text-brand-yellow"><EditableText settingKey="emp.titleAccent" defaultValue={empTitleAccent} /></span>
              </h2>

              <p className="text-slate-900 dark:text-gray-100 mb-8 max-w-md leading-relaxed">
                <EditableText settingKey="emp.desc" defaultValue={empDesc} multiline />
              </p>

              {/* Features list */}
              <ul className="space-y-3 mb-10">
                {h.empFeatures.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-900 dark:text-gray-100 text-sm"
                  >
                    <CheckCircle
                      size={17}
                      className="text-brand-gold flex-shrink-0 mt-0.5"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="btn-primary px-7 py-3 flex items-center gap-2 text-sm font-semibold"
                >
                  <Briefcase size={15} /> {h.empRegister}{" "}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline px-7 py-3 flex items-center gap-2 text-sm"
                >
                  <LogIn size={15} /> {h.empLogin}
                </Link>
              </div>
            </div>

            {/* Right: stats */}
            <div className="flex items-center justify-center p-10 lg:p-14 bg-white/[0.02] border-t lg:border-t-0 lg:border-l border-brand-border">
              <div className="grid grid-cols-1 gap-8 w-full max-w-xs">
                {h.empStats.map((val: string, i: number) => (
                  <div key={i} className="text-center">
                    <p className="font-display text-5xl gradient-text mb-1">
                      {val}
                    </p>
                    <p className="text-slate-900 dark:text-gray-100 text-sm">
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
