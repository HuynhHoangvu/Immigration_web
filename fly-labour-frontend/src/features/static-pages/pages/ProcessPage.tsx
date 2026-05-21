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
import { useT } from "@core/hooks/useT";
import s from "./ProcessPage.module.scss";

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
    <div className={`${s.page} fl-surface-page`}>
      <div className={s.hero}>
        <div className={s.heroBg} />
        <div
          className={s.heroOrb}
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className={`${s.heroInner} fl-max-3xl`}>
          <p className={s.badge}>{d.badge}</p>
          <h1 className={s.title}>
            {d.title}
            <br />
            <span className={s.titleAccent}>{d.titleAccent}</span>
          </h1>
          <p className={s.desc}>{d.desc}</p>
        </div>
      </div>

      <div className={s.steps}>
        <div className="fl-max-4xl">
          <div className={s.stepsList}>
            {STEPS.map((step, i) => (
              <div key={step.num} className={s.stepCard}>
                <div className={s.stepSide}>
                  <div
                    className={s.stepNum}
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && <div className={s.stepLine} />}
                </div>
                <div className={s.stepBody}>
                  <div className={s.stepTop}>
                    <div>
                      <h3 className={s.stepTitle}>{step.title}</h3>
                      <p className={s.stepDesc}>{step.desc}</p>
                    </div>
                    <span className={s.stepNote}>{step.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.docs}>
        <div className="fl-max-4xl">
          <div className={s.centerHead}>
            <p className={s.badge}>{d.d_badge}</p>
            <h2 className={s.headTitle}>{d.d_title}</h2>
          </div>
          <div className={s.docsGrid}>
            {DOCS.map((doc, i) => (
              <div key={i} className={s.docItem}>
                <CheckCircle size={16} className={s.docIcon} />
                <span className={s.docText}>{doc}</span>
              </div>
            ))}
          </div>
          <p className={s.docNote}>{d.d_note}</p>
        </div>
      </div>

      <div className={s.cta}>
        <div className={`${s.ctaCard} fl-max-4xl`}>
          <div className={s.ctaOrb} />
          <div className={s.ctaHeadsetWrap}>
            <HeadphonesIcon size={32} className={s.ctaHeadset} />
          </div>
          <h2 className={s.ctaTitle}>{d.cta_title}</h2>
          <p className={`${s.ctaDesc} fl-max-xl`}>{d.cta_desc}</p>
          <div className={s.ctaActions}>
            <Link to="/contact" className={`btn-primary ${s.ctaPrimary}`}>
              {d.cta_btn1} <ArrowRight size={16} />
            </Link>
            <Link to="/jobs" className={s.ctaSecondary}>
              {d.cta_btn2}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
