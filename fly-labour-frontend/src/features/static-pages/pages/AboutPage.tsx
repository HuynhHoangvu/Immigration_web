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
import { useT } from "@core/hooks/useT";
import CountryFlag from "@components/widgets/CountryFlag";
import s from "./AboutPage.module.scss";

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
    <div className={`${s.page} fl-surface-page`}>
      <div className={s.hero}>
        <div className={s.heroBg} />
        <div
          className={s.heroOrb}
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className={`${s.heroInner} fl-max-4xl`}>
          <p className={s.badge}>{d.badge}</p>
          <h1 className={s.title}>
            {d.title}
            <br />
            <span className={s.titleAccent}>{d.titleAccent}</span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>{d.desc}</p>
          <div className={s.heroActions}>
            <Link to="/jobs" className={`btn-primary ${s.jobsBtn}`}>
              {d.btnJobs} <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className={s.contactBtn}>
              {d.btnContact}
            </Link>
          </div>
        </div>
      </div>

      <div className={s.stats}>
        <div className={`${s.statsGrid} fl-max-5xl`}>
          {STATS.map((item) => (
            <div key={item.label} className={s.statItem}>
              <p className={s.statValue}>{item.value}</p>
              <p className={s.statLabel}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={s.section}>
        <div className={`${s.twoCol} fl-max-6xl`}>
          <div>
            <p className={s.sectionBadge}>{d.m_badge}</p>
            <h2 className={s.sectionTitle}>{d.m_title}</h2>
            <p className={`${s.paragraph} ${s.paragraphSpacing}`}>{d.m_desc1}</p>
            <p className={s.paragraph}>{d.m_desc2}</p>
          </div>
          <div className={s.countriesGrid}>
            {[
              { label: d.c_aus, flagCode: "australia", jobs: `1,200+ ${d.jobs}` },
              { label: d.c_can, flagCode: "canada", jobs: `800+ ${d.jobs}` },
              { label: d.c_nz, flagCode: "new_zealand", jobs: `600+ ${d.jobs}` },
              {
                label: d.c_other,
                flagCode: "other",
                jobs: Object.values(d).includes("Và nhiều hơn") ? "12+ quốc gia khác" : d.other_countries,
              },
            ].map((country) => (
              <div key={country.label} className={s.countryCard}>
                <div className="flex justify-center mb-2">
                  {country.flagCode === "other" ? (
                    <Globe size={32} className="text-amber-500" />
                  ) : (
                    <CountryFlag country={country.flagCode} style={{ width: "2.5rem", height: "auto" }} />
                  )}
                </div>
                <p className={s.countryLabel}>{country.label}</p>
                <p className={s.countryJobs}>{country.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.mutedSection}>
        <div className="fl-max-6xl">
          <div className={s.centerHead}>
            <p className={s.sectionBadge}>{d.svc_badge}</p>
            <h2 className={s.sectionTitle}>{d.svc_title}</h2>
          </div>
          <div className={s.servicesGrid}>
            {SERVICES.map((item) => (
              <div key={item.title} className={s.serviceCard}>
                <div
                  className={s.serviceIcon}
                  style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                >
                  <item.icon size={18} />
                </div>
                <h3 className={s.serviceTitle}>{item.title}</h3>
                <p className={s.serviceDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.section}>
        <div className={`${s.twoCol} fl-max-6xl`}>
          <div>
            <p className={s.sectionBadge}>{d.w_badge}</p>
            <h2 className={s.sectionTitle}>{d.w_title}</h2>
            <ul className={s.whyList}>
              {WHYS.map((why, idx) => (
                <li key={idx} className={s.whyItem}>
                  <CheckCircle size={16} className={s.whyIcon} />
                  <span className={s.whyText}>{why}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.teamPanel}>
            <h3 className={s.teamTitle}>{d.t_title}</h3>
            <div className={s.teamGrid}>
              {TEAM.map((member) => (
                <div key={member.name} className={s.teamMember}>
                  <div
                    className={s.memberAvatar}
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {member.initial}
                  </div>
                  <div className={s.memberMeta}>
                    <p className={s.memberName}>{member.name}</p>
                    <p className={s.memberRole}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={s.contactSection}>
        <div className={`${s.contactHead} fl-max-4xl`}>
          <h2 className={s.contactTitle}>{d.ct_title}</h2>
          <p className={s.contactDesc}>{d.ct_desc}</p>
          <div className={s.contactGrid}>
            {[
              { icon: Phone, label: d.ct_hotline, value: "0901 234 567" },
              { icon: Mail, label: d.ct_email, value: "info@flylabour.com" },
              { icon: MapPin, label: d.ct_addr, value: "123 Nguyễn Văn Linh, Q.7, TP.HCM" },
            ].map((contact) => (
              <div key={contact.label} className={s.contactCard}>
                <contact.icon size={20} className={s.contactIcon} />
                <p className={s.contactLabel}>{contact.label}</p>
                <p className={s.contactValue}>{contact.value}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className={`btn-primary ${s.contactCta}`}>
            {d.ct_btn} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
