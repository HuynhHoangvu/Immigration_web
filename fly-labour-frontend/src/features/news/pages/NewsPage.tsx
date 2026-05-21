import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, ArrowRight, Newspaper, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import s from "./NewsPage.module.scss";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

export default function NewsPage() {
  const [search, setSearch] = useState("");

  const newsQuery = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await newsApi.getAll();
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const news = newsQuery.data ?? [];
  const isLoading = newsQuery.isLoading;
  const filtered = news.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.excerpt || "").toLowerCase().includes(search.toLowerCase()),
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-strip-breadcrumb ${s.headerStrip}`}>
        <div className={`fl-container-7xl ${s.headerInner}`}>
          <div className={s.badge}>
            <Newspaper size={14} className={s.badgeIcon} />
            <span className={s.badgeText}>
              Tạp chí FLY LABOUR
            </span>
          </div>
          <h1 className={s.title}>
            <span className="gradient-text">Tin tức & Cập nhật</span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>
            Nơi cập nhật những thay đổi mới nhất về chính sách di trú và thị
            trường nhân lực toàn cầu.
          </p>
        </div>
      </div>

      <div className={`fl-container-7xl ${s.content}`}>
        <div className={`fl-max-2xl ${s.searchWrap}`}>
          <Search size={20} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bạn muốn tìm hiểu thông tin gì?"
            className={s.searchInput}
          />
        </div>

        {isLoading ? (
          <div className={s.loadingWrap}>
            <Loader2 size={40} className={`animate-spin ${s.loader}`} />
            <p className={s.loadingText}>
              Đang tải bản tin...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${s.empty} fl-max-3xl`}>
            <div className={s.emptyEmoji}>🏜️</div>
            <p className={s.emptyTitle}>
              Không tìm thấy bài viết
            </p>
            <p className={s.emptyDesc}>
              Thử tìm kiếm với một từ khóa khác nhé!
            </p>
          </div>
        ) : (
          <div className={s.sections}>
            {featured && (
              <div className={s.featuredBlock}>
                <div className={s.featuredHeading}>
                  <div className={s.featuredLine} />
                  <h2 className={s.featuredLabel}>
                    Tiêu điểm hôm nay
                  </h2>
                  <div className={s.featuredLine} />
                </div>

                <Link to={`/news/${featured.slug}`} className={s.featuredLink}>
                  <div className={`${s.cardBase} ${s.featuredCard}`}>
                    <div className={s.featuredImage}>
                      {featured.image ? (
                        <img
                          src={getImageUrl(featured.image)}
                          alt={featured.title}
                          className={s.img}
                        />
                      ) : (
                        <div className={s.placeholder}>
                          📰
                        </div>
                      )}
                      <div className={s.trendBadge}>
                        🔥 Trending
                      </div>
                    </div>
                    <div className={s.featuredBody}>
                      <div className={s.meta}>
                        <Calendar size={14} className={s.metaIcon} />
                        {formatDate(featured.createdAt)}
                      </div>
                      <h2 className={s.featuredTitle}>
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className={s.featuredExcerpt}>
                          {featured.excerpt}
                        </p>
                      )}
                      <span className={s.featuredCta}>
                        Khám phá chi tiết <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <div className={s.listGrid}>
              {rest.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className={`${s.cardBase} ${s.listCard}`}
                >
                  <div className={s.listImage}>
                    {article.image ? (
                      <img
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        className={s.img}
                      />
                    ) : (
                      <div className={s.placeholder}>
                        📰
                      </div>
                    )}
                  </div>
                  <div className={s.listBody}>
                    <div className={s.meta}>
                      <Calendar size={12} className={s.metaIcon} />
                      {formatDate(article.createdAt)}
                    </div>
                    <h3 className={s.listTitle}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className={s.listExcerpt}>
                        "{article.excerpt}"
                      </p>
                    )}
                    <div className={s.listFooter}>
                      <span className={s.readMore}>
                        Đọc tiếp
                      </span>
                      <div className={s.arrowBox}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
