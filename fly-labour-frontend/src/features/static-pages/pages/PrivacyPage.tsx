import { Link } from "react-router-dom";
import clsx from "clsx";
import { Shield } from "lucide-react";
import { useT } from "@core/hooks/useT";
import styles from "./PrivacyPage.module.scss";

export default function PrivacyPage() {
  const { t } = useT();
  const d = t("privacy");

  const SECTIONS = d.sections || [];

  return (
    <div className={clsx(styles.page, "fl-surface-page")}>
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={clsx(styles.heroInner, "fl-max-3xl")}>
          <Shield size={40} className={styles.heroIcon} />
          <h1 className={styles.heroTitle}>{d.title}</h1>
          <p className={styles.desc}>{d.desc}</p>
          <p className={clsx(styles.sub, "fl-max-xl")}>{d.sub}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={clsx("fl-max-3xl", styles.list)}>
          {SECTIONS.map((sec: any) => (
            <div key={sec.title} className={styles.card}>
              <h2 className={styles.cardTitle}>{sec.title}</h2>
              <div className={clsx(styles.body, "whitespace-pre-line")}>
                {(sec.content || "").split("\n").map((line: string, i: number) => {
                  if (line.startsWith("• **")) {
                    const parts = line.replace("• **", "").split(":**");
                    return (
                      <p key={i} className={styles.bulletRow}>
                        <span className={styles.bulletDot}>•</span>
                        <span>
                          <strong className={styles.strong}>{parts[0]}:</strong>
                          {parts.length > 1 ? parts[1] : ""}
                        </span>
                      </p>
                    );
                  }
                  if (line.startsWith("• ")) {
                    return (
                      <p key={i} className={styles.bulletRow}>
                        <span className={styles.bulletDot}>•</span>
                        <span>{line.slice(2)}</span>
                      </p>
                    );
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className={styles.sectionLead}>
                        {line.slice(2, -2)}
                      </p>
                    );
                  }
                  return line ? (
                    <p key={i} className={styles.para}>
                      {line}
                    </p>
                  ) : (
                    <br key={i} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaSection}>
        <p className={styles.ctaText}>{d.cta_title}</p>
        <Link to="/contact" className={clsx("btn-primary", styles.ctaBtn)}>
          {d.cta_btn}
        </Link>
      </div>
    </div>
  );
}
