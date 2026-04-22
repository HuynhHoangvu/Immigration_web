import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useT } from "../../../core/hooks/useT";

export default function AboutPage() {
  const { t } = useT();
  const d = t("about");

  const STATS = [
    { value: "5,000+", label: d.s_workers },
    { value: "200+", label: d.s_partners },
    { value: "15+", label: d.s_countries },
    { value: "10+", label: d.s_exp },
  ];

  const SERVICES = [
    {
      icon: Globe,
      title: d.svc_l_title,
      desc: d.svc_l_desc,
    },
    {
      icon: Briefcase,
      title: d.svc_c_title,
      desc: d.svc_c_desc,
    },
    {
      icon: Users,
      title: d.svc_e_title,
      desc: d.svc_e_desc,
    },
    {
      icon: Award,
      title: d.svc_s_title,
      desc: d.svc_s_desc,
    },
  ];

  const WHYS = [d.w1, d.w2, d.w3, d.w4, d.w5, d.w6];

  const TEAM = [
    { name: "Nguyễn Văn An", role: d.t_ceo, initial: "A" },
    { name: "Trần Thị Bình", role: d.t_consultant, initial: "B" },
    { name: "Lê Minh Cường", role: d.t_legal, initial: "C" },
    { name: "Phạm Thu Dung", role: d.t_training, initial: "D" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-600 dark:text-brand-gold text-sm font-bold tracking-widest uppercase mb-4">
            {d.badge}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
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
          <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {d.desc}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link to="/jobs" className="btn-primary flex items-center gap-2 px-6 py-3">
              {d.btnJobs} <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
            >
              {d.btnContact}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-14 px-6 border-y border-slate-200 dark:border-brand-border bg-white/60 dark:bg-brand-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </p>
              <p className="text-slate-600 dark:text-gray-300 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              {d.m_badge}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-5">
              {d.m_title}
            </h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
              {d.m_desc1}
            </p>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
              {d.m_desc2}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: d.c_aus, flag: "🇦🇺", jobs: `1,200+ ${d.jobs}` },
              { label: d.c_can, flag: "🇨🇦", jobs: `800+ ${d.jobs}` },
              { label: d.c_nz, flag: "🇳🇿", jobs: `600+ ${d.jobs}` },
              { label: d.c_other, flag: "🌏", jobs: Object.values(d).includes("Và nhiều hơn") ? "12+ quốc gia khác" : d.other_countries },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-4 text-center shadow-sm dark:shadow-none transition-colors"
              >
                <p className="text-3xl mb-2">{c.flag}</p>
                <p className="text-slate-900 dark:text-white text-sm font-semibold">{c.label}</p>
                <p className="text-amber-600 dark:text-brand-gold text-xs font-medium mt-1">{c.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 px-6 bg-slate-100/50 dark:bg-brand-card/20 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              {d.svc_badge}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {d.svc_title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-5 hover:border-amber-400 dark:hover:border-brand-gold/30 shadow-sm dark:shadow-none transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md"
                  style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                >
                  <s.icon size={18} className="text-slate-900" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm">{s.title}</h3>
                <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why us */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              {d.w_badge}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              {d.w_title}
            </h2>
            <ul className="space-y-3">
              {WHYS.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-amber-500 dark:text-brand-gold shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-gray-300 text-sm font-medium">{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-8 transition-colors">
            <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-6">{d.t_title}</h3>
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold shrink-0 shadow-sm"
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {m.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{m.name}</p>
                    <p className="text-slate-500 dark:text-gray-300 text-xs font-medium truncate">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="py-16 px-6 bg-slate-100/50 dark:bg-brand-card/20 border-t border-slate-200 dark:border-brand-border transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            {d.ct_title}
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8">{d.ct_desc}</p>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Phone, label: d.ct_hotline, value: "0901 234 567" },
              { icon: Mail, label: d.ct_email, value: "info@flylabour.com" },
              { icon: MapPin, label: d.ct_addr, value: "123 Nguyễn Văn Linh, Q.7, TP.HCM" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors"
              >
                <c.icon size={20} className="text-amber-500 dark:text-brand-gold mx-auto mb-3" />
                <p className="text-slate-500 dark:text-gray-300 text-xs font-medium mb-1">{c.label}</p>
                <p className="text-slate-900 dark:text-white text-sm font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            {d.ct_btn} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
