import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import s from "./HandbookPage.module.scss";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

export default function HandbookPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    newsApi
      .getAllHandbook()
      .then((r) => {
        setItems(r.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.excerpt || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-strip-breadcrumb ${s.headerStrip}`}>
        <div className={`fl-container-7xl ${s.headerInner}`}>
          <div className={s.badge}>
            <BookOpen size={14} className={s.badgeIcon} />
            <span className={s.badgeText}>
              Cẩm nang định cư & Visa
            </span>
          </div>
          <h1 className={s.title}>
            <span className="gradient-text">Cẩm nang FLY LABOUR</span>
          </h1>
          <p className={`${s.desc} fl-max-2xl`}>
            Toàn bộ kinh nghiệm, quy trình và những lưu ý quan trọng khi bắt đầu hành trình vươn tầm thế giới.
          </p>
        </div>
      </div>

      <div className={`fl-container-7xl ${s.content}`}>
        <div className={`fl-max-2xl ${s.searchWrap}`}>
          <Search size={20} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tài liệu, hướng dẫn..."
            className={s.searchInput}
          />
        </div>

        {loading ? (
          <div className={s.loadingWrap}>
            <Loader2 size={40} className={`animate-spin ${s.loader}`} />
            <p className={s.loadingText}>
              Đang tra cứu cẩm nang...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`${s.empty} fl-max-3xl`}>
            <div className={s.emptyEmoji}>📚</div>
            <p className={s.emptyTitle}>
              Không tìm thấy nội dung
            </p>
            <p className={s.emptyDesc}>
              Bạn có thể thử tìm kiếm theo tên quốc gia hoặc loại visa.
            </p>
          </div>
        ) : (
          <div className={s.grid}>
            {filtered.map((item) => (
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
                      className={s.img}
                    />
                  ) : (
                    <div className={s.placeholder}>
                      📖
                    </div>
                  )}
                  <div className={s.overlay}>
                     <span className={s.overlayText}>
                        Đọc tài liệu <ArrowRight size={14} />
                     </span>
                  </div>
                </div>
                <div className={s.body}>
                  <div className={s.meta}>
                    <Calendar size={12} className={s.metaIcon} />
                    {formatDate(item.createdAt)}
                  </div>
                  <h3 className={s.cardTitle}>
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className={s.excerpt}>
                      {item.excerpt}
                    </p>
                  )}
                  <div className={s.footer}>
                     <BookOpen size={16} className={s.footerIcon} />
                     <span className={s.footerText}>
                        Xem chi tiết
                     </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
