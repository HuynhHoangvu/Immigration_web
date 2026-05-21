/**
 * Admin layout template demo (light UI only).
 */

import clsx from "clsx";
import s from "./TemplateComponent.module.scss";

interface TemplateComponentProps {
  title: string;
  description?: string;
  variant?: "default" | "highlighted";
}

export function TemplateComponent({
  title,
  description,
  variant = "default",
}: TemplateComponentProps) {
  return (
    <div className={s.root}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <h1 className={s.title}>{title}</h1>
          <span className={s.badge}>Light UI</span>
        </div>
      </header>

      <main className={s.main}>
        <div className={clsx(s.grid, variant === "highlighted" && s.gridMb)}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>Card Title</h2>
            <p className={s.cardText}>
              {description ||
                "Mô tả nội dung card (giao diện chỉ có chế độ sáng)."}
            </p>
            <button type="button" className={s.btnPrimary}>
              Learn More
            </button>
          </section>

          <section className={s.cardHighlight}>
            <div className={s.pill}>Popular</div>
            <h2 className={s.cardTitle}>Featured Card</h2>
            <p className={s.cardText}>
              Sử dụng border và background màu khác để highlight card.
            </p>
            <button type="button" className={s.btnGradient}>
              Get Started
            </button>
          </section>

          <section className={s.card}>
            <h2 className={s.cardTitle}>Statistics</h2>
            <div className={s.statsBlock}>
              <div>
                <div className={s.statRow}>
                  <span className={s.statLabel}>Progress</span>
                  <span className={s.statValue}>75%</span>
                </div>
                <div className={s.progressTrack}>
                  <div className={s.progressFill} />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className={s.formSection}>
          <h2 className={s.formTitle}>Contact Form</h2>

          <form className={s.form}>
            <div>
              <label htmlFor="tpl-name" className={s.fieldLabel}>
                Full Name
              </label>
              <input
                id="tpl-name"
                type="text"
                placeholder="Enter your name"
                className={s.fieldInput}
              />
            </div>

            <div>
              <label htmlFor="tpl-email" className={s.fieldLabel}>
                Email
              </label>
              <input
                id="tpl-email"
                type="email"
                placeholder="your@email.com"
                className={s.fieldInput}
              />
            </div>

            <div>
              <label htmlFor="tpl-msg" className={s.fieldLabel}>
                Message
              </label>
              <textarea
                id="tpl-msg"
                rows={4}
                placeholder="Your message..."
                className={clsx(s.fieldInput, s.textarea)}
              />
            </div>

            <button type="submit" className={s.submitBtn}>
              Send Message
            </button>
          </form>
        </section>

        <section className={s.infoBox}>
          <p className={s.infoText}>
            <span className={s.infoStrong}>💡 Tip:</span> Dự án dùng một bảng
            màu sáng thống nhất.
          </p>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerInner}>
          <p className={s.footerText}>
            © 2024 Template Component. Light UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
