import { Shield, Globe, Clock, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@core/hooks/useT";
import s from "./WhyChooseUs.module.scss";

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
    <section className={s.section}>
      <div className={s.sectionBg} />

      <div className={`fl-shell ${s.shell}`}>
        <div className={s.inner}>
          <div className={s.statsGrid}>
            {h.statsValues.map((val: string, i: number) => (
              <div key={i} className={s.statCard}>
                <div className={s.statIconWrap}>
                  <img
                    src={`/dashboar_img/${i + 1}.png`}
                    alt=""
                    className={s.statIcon}
                  />
                </div>
                <p className={`gradient-text ${s.statValue}`}>
                  {val}
                </p>
                <p className={s.statLabel}>
                  {h.statsLabels[i]}
                </p>
              </div>
            ))}
          </div>

          <div className={s.bodyGrid}>
            <div>
              <p className={s.badge}>
                {h.whyBadge}
              </p>
              <h2 className={`section-title ${s.title}`}>
                {h.whyTitle}{" "}
                <span className="gradient-text">{h.whyTitleAccent}</span>{" "}
                {h.whySubtitle}
              </h2>
              <p className={s.desc}>
                {h.whyDesc}
              </p>
              <div className={s.actions}>
                <Link
                  to="/jobs"
                  className="btn-primary"
                >
                  {h.findJob}
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline"
                >
                  {h.freeConsult}
                </Link>
              </div>
            </div>

            <div className={s.featuresGrid}>
              {h.featureTitles.map((title: string, i: number) => (
                <div key={i} className={s.featureCard}>
                  <div className={s.featureIconWrap}>
                    {FEATURE_ICONS[i]}
                  </div>
                  <h4 className={s.featureTitle}>
                    {title}
                  </h4>
                  <p className={s.featureDesc}>
                    {h.featureDescs[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
