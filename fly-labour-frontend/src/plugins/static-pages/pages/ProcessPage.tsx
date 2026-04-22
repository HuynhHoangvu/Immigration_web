import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  CheckCircle,
  Plane,
  Briefcase,
  HeadphonesIcon,
} from "lucide-react";
import { useT } from "../../../core/hooks/useT";

export default function ProcessPage() {
  const { t } = useT();
  const d = t("process");

  const STEPS = [
    {
      num: "01",
      icon: Search,
      title: d.s1_title,
      desc: d.s1_desc,
      note: d.s1_note,
    },
    {
      num: "02",
      icon: FileText,
      title: d.s2_title,
      desc: d.s2_desc,
      note: d.s2_note,
    },
    {
      num: "03",
      icon: CheckCircle,
      title: d.s3_title,
      desc: d.s3_desc,
      note: d.s3_note,
    },
    {
      num: "04",
      icon: FileText,
      title: d.s4_title,
      desc: d.s4_desc,
      note: d.s4_note,
    },
    {
      num: "05",
      icon: Plane,
      title: d.s5_title,
      desc: d.s5_desc,
      note: d.s5_note,
    },
    {
      num: "06",
      icon: Briefcase,
      title: d.s6_title,
      desc: d.s6_desc,
      note: d.s6_note,
    },
  ];

  const DOCS = [
    d.d1,
    d.d2,
    d.d3,
    d.d4,
    d.d5,
    d.d6,
    d.d7,
    d.d8,
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">
            {d.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            {d.title}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {d.titleAccent}
            </span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
            {d.desc}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-6 flex gap-5 hover:border-amber-400 dark:hover:border-brand-gold/30 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-amber-900 text-sm shadow-md"
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 h-8 bg-slate-200 dark:bg-brand-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 dark:bg-brand-gold/10 dark:border-brand-gold/20 dark:text-brand-gold font-medium whitespace-nowrap">
                      {step.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="py-20 px-6 bg-slate-100/50 dark:bg-brand-card/20 border-y border-slate-200 dark:border-brand-border transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              {d.d_badge}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {d.d_title}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DOCS.map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-xl p-4 transition-colors"
              >
                <CheckCircle size={16} className="text-amber-500 dark:text-brand-gold shrink-0" />
                <span className="text-slate-700 dark:text-gray-300 text-sm font-medium">{doc}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 dark:text-gray-300 text-xs text-center mt-6 font-medium">
            {d.d_note}
          </p>
        </div>
      </div>

      {/* CTA Layer */}
      <div className="py-20 px-6 bg-white dark:bg-brand-card transition-colors">
        <div className="max-w-4xl mx-auto text-center border border-amber-200 dark:border-brand-gold/20 bg-gradient-to-b from-amber-50 to-white dark:from-brand-gold/5 dark:to-transparent rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 dark:bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          />
          <div className="relative z-10 w-16 h-16 bg-amber-500 shadow-lg shadow-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HeadphonesIcon size={32} className="text-white" />
          </div>
          <h2 className="relative z-10 text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {d.cta_title}
          </h2>
          <p className="relative z-10 text-slate-600 dark:text-gray-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
            {d.cta_desc}
          </p>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              {d.cta_btn1} <ArrowRight size={16} />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-gray-300 font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              {d.cta_btn2}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
