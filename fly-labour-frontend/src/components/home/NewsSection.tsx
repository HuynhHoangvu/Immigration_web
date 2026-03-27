import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { newsApi, getImageUrl } from "@/services/api";
import { useT } from "@/hooks/useT";
import type { News } from "@/types";
import { formatDate } from "@/utils/helpers";

const NEWS_EMOJIS = ["🇦🇺", "🇨🇦", "🇳🇿", "📰", "✈️"];

export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const { t } = useT()
  const h = t('home')

  useEffect(() => {
    newsApi.getAll().then((r) => setNews(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-2">
              {h.newsBadge}
            </p>
            <h2 className="section-title">
              {h.newsTitle} <span className="gradient-text">{h.newsTitleAccent}</span>
            </h2>
          </div>
          <Link to="/news" className="btn-outline text-sm px-4 py-2 flex items-center gap-1.5 whitespace-nowrap">
            {h.allNews} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item, i) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="card-dark group overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-yellow/10 transition-all duration-300"
            >
              <div className="h-44 bg-gradient-to-br from-brand-yellow/10 to-brand-orange/5 border-b border-brand-border flex items-center justify-center">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">{NEWS_EMOJIS[i % NEWS_EMOJIS.length]}</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-3">
                  <Calendar size={11} />
                  {formatDate(item.createdAt)}
                  <span className="ml-auto text-brand-yellow text-xs font-semibold">
                    {h.newsTags[i % h.newsTags.length]}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-brand-yellow transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-brand-muted text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>
                )}
                <div className="flex items-center gap-1 mt-4 text-xs text-brand-yellow font-medium">
                  {h.readMore} <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
