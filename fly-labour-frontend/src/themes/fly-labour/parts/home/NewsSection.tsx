import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { newsApi, getImageUrl } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import type { News } from "@/core/types";
import { formatDate } from "@/core/utils/helpers";

const NEWS_EMOJIS = ["🇦🇺", "🇨🇦", "🇳🇿", "📰", "✈️"];

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const { t } = useT();
  const h = t("home");

  useEffect(() => {
    newsApi
      .getAll()
      .then((r) => setNews(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, []);

  if (news.length === 0) return null;

  return (
    // Sửa nền thành bg-transparent để ăn theo nền xám của Layout tổng
    <section className="py-20 bg-transparent transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/20 mb-4 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <p className="text-amber-700 dark:text-brand-gold text-[10px] font-black uppercase tracking-widest">
                {h.newsBadge}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white transition-colors leading-tight">
              {h.newsTitle}{" "}
              <span className="text-amber-600 dark:text-brand-gold">
                {h.newsTitleAccent}
              </span>
            </h2>
          </div>
          <Link
            to="/news"
            className="group flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 dark:border-brand-border bg-white dark:bg-white/5 text-slate-600 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold hover:border-amber-400 dark:hover:border-brand-gold/50 transition-all shadow-sm"
          >
            {h.allNews}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item, i) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl group overflow-hidden hover:-translate-y-2 hover:border-amber-400 dark:hover:border-brand-gold/50 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-brand-gold/20 transition-all duration-500 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-52 bg-slate-100 dark:bg-brand-dark flex items-center justify-center transition-colors overflow-hidden">
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500 opacity-80">
                    {NEWS_EMOJIS[i % NEWS_EMOJIS.length]}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-brand-muted mb-4 transition-colors">
                  <Calendar size={13} className="text-amber-500" />
                  {formatDate(item.createdAt)}
                  <span className="ml-auto px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent transition-colors">
                    {h.newsTags[i % h.newsTags.length]}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors line-clamp-2 mb-3">
                  {item.title}
                </h3>

                {item.excerpt && (
                  <p className="text-slate-500 dark:text-brand-muted text-xs leading-relaxed line-clamp-3 flex-1 transition-colors font-medium">
                    {item.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-6 text-xs font-black uppercase tracking-widest text-amber-600 dark:text-brand-gold group-hover:gap-3 transition-all">
                  <span className="border-b-2 border-amber-600/20 group-hover:border-amber-600 transition-colors">
                    {h.readMore}
                  </span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
