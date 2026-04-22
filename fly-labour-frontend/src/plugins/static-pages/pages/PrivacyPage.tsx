import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useT } from "../../../core/hooks/useT";

export default function PrivacyPage() {
  const { t } = useT();
  const d = t("privacy");

  const SECTIONS = [
    {
      title: d.s1,
      content: d.c1,
    },
    {
      title: d.s2,
      content: d.c2,
    },
    {
      title: d.s3,
      content: d.c3,
    },
    {
      title: d.s4,
      content: d.c4,
    },
    {
      title: d.s5,
      content: d.c5,
    },
    {
      title: d.s6,
      content: d.c6,
    },
    {
      title: d.s7,
      content: d.c7,
    },
    {
      title: d.s8,
      content: d.c8,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Shield size={40} className="text-amber-500 dark:text-brand-gold mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {d.title}
          </h1>
          <p className="text-slate-500 dark:text-gray-300">{d.desc}</p>
          <p className="text-slate-600 dark:text-gray-300 text-sm mt-3 max-w-xl mx-auto">
            {d.sub}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-6 transition-colors"
            >
              <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-4">{s.title}</h2>
              <div className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {s.content.split("\n").map((line, i) => {
                  if (line.startsWith("• **")) {
                    const parts = line.replace("• **", "").split(":**");
                    return (
                      <p key={i} className="flex gap-2 mt-2">
                        <span className="text-amber-500 dark:text-brand-gold shrink-0">•</span>
                        <span>
                          <strong className="text-slate-900 dark:text-white">{parts[0]}:</strong>
                          {parts.length > 1 ? parts[1] : ""}
                        </span>
                      </p>
                    );
                  }
                  if (line.startsWith("• ")) {
                    return (
                      <p key={i} className="flex gap-2 mt-2">
                        <span className="text-amber-500 dark:text-brand-gold shrink-0">•</span>
                        <span>{line.slice(2)}</span>
                      </p>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-slate-900 dark:text-white mt-2">
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  return line ? <p key={i} className="mt-1">{line}</p> : <br key={i} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-12 px-6 border-t border-slate-200 dark:border-brand-border bg-slate-100/50 dark:bg-brand-card/20 transition-colors text-center">
        <p className="text-slate-600 dark:text-gray-300 text-sm mb-4">
          {d.cta_title}
        </p>
        <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
          {d.cta_btn}
        </Link>
      </div>
    </div>
  );
}
