import { ExternalLink, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@core/hooks/useT";
import s from "./EnglishTestCtaRow.module.scss";

const FEATURES = [
  "Đánh giá 4 kỹ năng: Nghe, Nói, Đọc, Viết",
  "Kết quả ngay lập tức, không cần chờ đợi",
  "Phù hợp hồ sơ xuất khẩu lao động",
  "Hoàn toàn miễn phí, không cần đăng ký",
];

export default function EnglishTestCtaRow() {
  const { t } = useT();
  const h = t("home");

  return (
    <section className={s.section}>
      <div className="fl-shell">
        <div className={s.grid}>

          <div className={`${s.card} ${s.leftCard}`}>
            <div className={s.cardBg} />
            <div className={s.leftBody}>
              <div className={s.badge}>
                <Zap size={12} className={s.badgeIcon} />
                <span className={s.badgeText}>
                  Miễn phí 100%
                </span>
              </div>

              <h2 className={s.leftTitle}>
                KIỂM TRA TIẾNG ANH MIỄN PHÍ
              </h2>

              <p className={s.leftDesc}>
                Kiểm tra trình độ tiếng Anh ngay hôm nay để tăng cơ hội được
                chọn trong các đơn tuyển dụng quốc tế.
              </p>

              <ul className={s.featureList}>
                {FEATURES.map((f) => (
                  <li key={f} className={s.featureItem}>
                    <CheckCircle
                      size={15}
                      className={s.featureIcon}
                    />
                    <span className={s.featureText}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={s.testBtnWrap}>
                <a
                  href="https://flytest.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Làm bài ngay
                  <ExternalLink
                    size={15}
                    className={s.testBtnIcon}
                  />
                </a>
              </div>
            </div>
          </div>
 
          <div className={`${s.card} ${s.rightCard}`}>
            <div className={s.cardBg} />
            <div className={s.rightBody}>
              <p className={s.rightBadge}>
                {h.ctaBadge}
              </p>
              <h2 className={s.rightTitle}>
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className={s.rightDesc}>
                {h.ctaDesc}
              </p>
              <div className={s.ctaActions}>
                <Link to="/register" className="btn-primary">
                  {h.ctaRegister}
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline"
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
