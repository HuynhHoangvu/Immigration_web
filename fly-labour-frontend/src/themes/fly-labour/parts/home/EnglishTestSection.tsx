import { ExternalLink, BookOpen, CheckCircle, Zap } from "lucide-react";

const FEATURES = [
  "Đánh giá 4 kỹ năng: Nghe, Nói, Đọc, Viết",
  "Kết quả ngay lập tức, không cần chờ đợi",
  "Phù hợp hồ sơ xuất khẩu lao động",
  "Hoàn toàn miễn phí, không cần đăng ký",
];

export default function EnglishTestSection() {
  return (
    <section className="py-16 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-10 md:p-14 relative overflow-hidden transition-colors">
          {/* Subtle amber gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-transparent to-amber-100/40 dark:from-brand-gold/5 dark:via-transparent dark:to-brand-orange/5 transition-colors duration-500 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14">


            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 mb-4">
                <Zap size={12} className="text-amber-600 dark:text-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-brand-gold">
                  Miễn phí 100%
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
                KIỂM TRA TIẾNG ANH MIỄN PHÍ{" "}
              </h2>

              <p className="text-slate-600 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                Kiểm tra trình độ tiếng Anh ngay hôm nay để tăng cơ hội được
                chọn trong các đơn tuyển dụng quốc tế.
              </p>

              <ul className="grid sm:grid-cols-2 gap-2 mb-8 text-left">
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
      </div>
    </section>
  );
}
