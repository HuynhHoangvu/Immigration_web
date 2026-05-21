import { Link } from "react-router-dom";
import { useT } from "@core/hooks/useT";
import s from "./CtaSection.module.scss";

export default function CtaSection() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className={`fl-max-4xl ${s.wrap}`}>
          <div className={s.card}>
            {/* Gradient nền thay đổi linh hoạt theo Mode */}
            <div className={s.cardGradient} />

            <div className={s.content}>
              <p className={s.badge}>
                {h.ctaBadge}
              </p>
              <h2 className={s.title}>
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className={`fl-max-lg ${s.desc}`}>
                {h.ctaDesc}
              </p>
              <div className={s.actions}>
                <Link
                  to="/register"
                  className={`btn-primary ${s.primaryBtn}`}
                >
                  {h.ctaRegister}
                </Link>
                {/* Thay btn-outline bằng class linh hoạt Light/Dark */}
                <Link
                  to="/contact"
                  className={s.secondaryBtn}
                >
                  {h.ctaConsult}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
