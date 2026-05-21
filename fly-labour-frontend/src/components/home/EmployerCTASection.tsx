import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Briefcase, LogIn } from "lucide-react";
import { useT } from "@core/hooks/useT";
import s from "./EmployerCTASection.module.scss";

export default function EmployerCTASection() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className="fl-max-7xl">
          <div className={s.panel}>
            <div className={s.bgGradient} />
            <div
              className={s.orb}
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            />

            <div className={s.grid}>
              {/* Left: content */}
              <div className={s.content}>
                <span className={s.badge}>
                  <Briefcase size={12} /> {h.empBadge}
                </span>

                <h2 className={s.title}>
                  {h.empTitle}
                  <br />
                  <span className={s.titleAccent}>
                    {h.empTitleAccent}
                  </span>
                </h2>

                <p className={s.desc}>
                  {h.empDesc}
                </p>

                <ul className={s.features}>
                  {h.empFeatures.map((f: string, i: number) => (
                    <li
                      key={i}
                      className={s.featureItem}
                    >
                      <CheckCircle
                        size={17}
                        className={s.featureIcon}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={s.actions}>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    <Briefcase size={15} /> {h.empRegister}{" "}
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn-outline"
                  >
                    <LogIn size={15} /> {h.empLogin}
                  </Link>
                </div>
              </div>

              {/* Right: stats */}
              <div className={s.stats}>
                <div className={s.statsGrid}>
                  {h.empStats.map((val: string, i: number) => (
                    <div key={i} className={s.statItem}>
                      <p className={`${s.statValue} gradient-text`}>
                        {val}
                      </p>
                      <p className={s.statLabel}>
                        {h.empStatsLabels[i]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
