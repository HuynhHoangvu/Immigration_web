import { ExternalLink, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/core/hooks/useT";

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
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          {/* English Test Card */}
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-5 sm:p-7 lg:p-10 relative overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100/40 dark:from-brand-gold/5 dark:via-transparent dark:to-brand-orange/5 transition-colors duration-500 pointer-events-none" />
            <div className="relative flex flex-col h-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 mb-4 w-fit">
                <Zap size={12} className="text-amber-600 dark:text-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-brand-gold">
                  Miễn phí 100%
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                KIỂM TRA TIẾNG ANH MIỄN PHÍ
              </h2>

              <p className="text-slate-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                Kiểm tra trình độ tiếng Anh ngay hôm nay để tăng cơ hội được
                chọn trong các đơn tuyển dụng quốc tế.
              </p>

              <ul className="grid sm:grid-cols-2 gap-2 mb-8">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle
                      size={15}
                      className="text-amber-500 dark:text-brand-gold flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <a
                  href="https://flytest.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-all duration-200 shadow-md shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5 group"
                >
                  Làm bài ngay
                  <ExternalLink
                    size={15}
                    className="opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 lg:p-12 relative overflow-hidden transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100/40 dark:from-brand-gold/5 dark:via-transparent dark:to-brand-orange/5 transition-colors duration-500" />
            <div className="relative flex flex-col items-center justify-center text-center h-full gap-4">
              <p className="text-amber-600 dark:text-brand-gold font-bold text-sm uppercase tracking-widest">
                {h.ctaBadge}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white tracking-wide transition-colors">
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className="text-slate-600 dark:text-brand-muted max-w-sm leading-relaxed transition-colors">
                {h.ctaDesc}
              </p>
              <div className="flex justify-center gap-4 flex-wrap mt-2">
                <Link to="/register" className="btn-primary px-8 py-3 font-medium">
                  {h.ctaRegister}
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-medium"
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
