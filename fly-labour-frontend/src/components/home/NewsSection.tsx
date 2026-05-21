import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import type { News } from "@core/types";
import { formatDate } from "@core/utils/helpers";
import s from "./NewsSection.module.scss";

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
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className={s.head}>
          <div>
            <div className={s.badge}>
              <span className={s.pulseWrap}>
                <span className={s.pulse}></span>
                <span className={s.dot}></span>
              </span>
              <p className={s.badgeText}>
                {h.newsBadge}
              </p>
            </div>
            <h2 className={s.title}>
              {h.newsTitle}{" "}
              <span className={s.titleAccent}>
                {h.newsTitleAccent}
              </span>
            </h2>
          </div>
          <Link
            to="/news"
            className={s.allBtn}
          >
            {h.allNews}
            <ArrowRight size={16} className={s.allBtnIcon} />
          </Link>
        </div>

        <div className={s.grid}>
          {news.slice(0, 3).map((item, i) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className={s.card}
            >
              <div className={s.imageWrap}>
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className={s.image}
                  />
                ) : (
                  <span className={s.emoji}>
                    {NEWS_EMOJIS[i % NEWS_EMOJIS.length]}
                  </span>
                )}
                <div className={s.imageOverlay} />
              </div>

              <div className={s.content}>
                <div className={s.meta}>
                  <Calendar size={13} className={s.calendar} />
                  {formatDate(item.createdAt)}
                  <span className={s.tag}>
                    {h.newsTags[i % h.newsTags.length]}
                  </span>
                </div>

                <h3 className={s.cardTitle}>
                  {item.title}
                </h3>

                {item.excerpt && (
                  <p className={s.excerpt}>
                    {item.excerpt}
                  </p>
                )}

                <div className={s.readMore}>
                  <span className={s.readMoreText}>
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
