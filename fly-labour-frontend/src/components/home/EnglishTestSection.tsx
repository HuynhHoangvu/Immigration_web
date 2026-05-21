import { ExternalLink, CheckCircle, Zap } from "lucide-react";
import s from "./EnglishTestSection.module.scss";

const FEATURES = [
  "Đánh giá 4 kỹ năng: Nghe, Nói, Đọc, Viết",
  "Kết quả ngay lập tức, không cần chờ đợi",
  "Phù hợp hồ sơ xuất khẩu lao động",
  "Hoàn toàn miễn phí, không cần đăng ký",
];

export default function EnglishTestSection() {
  return (
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className="fl-max-4xl">
          <div className={s.inner}>
            <div className={s.overlay} />

            <div className={s.body}>
              <div className={s.content}>
                <div className={s.badge}>
                  <Zap size={12} className={s.badgeIcon} />
                  <span className={s.badgeText}>
                    Miễn phí 100%
                  </span>
                </div>

                <h2 className={s.title}>
                  KIỂM TRA TIẾNG ANH MIỄN PHÍ{" "}
                </h2>

                <p className={s.desc}>
                  Kiểm tra trình độ tiếng Anh ngay hôm nay để tăng cơ hội được
                  chọn trong các đơn tuyển dụng quốc tế.
                </p>

                <ul className={s.features}>
                  {FEATURES.map((f) => (
                    <li key={f} className={s.featureItem}>
                      <CheckCircle size={15} className={s.featureIcon} />
                      <span className={s.featureText}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://flytest.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.testBtn}
                >
                  Làm bài ngay
                  <ExternalLink size={15} className={s.testBtnIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
