import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2, Clock } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import s from "./NewsDetailPage.module.scss";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    newsApi
      .getOne(slug)
      .then((r) => setArticle(r.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className={`${s.centerState} fl-surface-page`}>
        <div className={s.loadingInner}>
          <div className={`animate-spin ${s.spinner}`} />
          <p className={s.loadingText}>
            Đang tải bài viết...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className={`${s.centerState} fl-surface-page`}>
        <div className={`${s.emptyWrap} fl-max-lg`}>
          <div className={s.emptyIcon}>
            🔍
          </div>
          <h2 className={s.emptyTitle}>
            Không tìm thấy bài viết
          </h2>
          <p className={s.emptyDesc}>
            Nội dung bạn đang tìm kiếm có thể đã bị gỡ bỏ hoặc đường dẫn không
            chính xác.
          </p>
          <Link
            to="/news"
            className={`btn-primary ${s.backBtn}`}
          >
            <ArrowLeft size={16} /> Quay lại Tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={`fl-strip-breadcrumb ${s.strip}`}>
        <div className={`fl-container-4xl ${s.crumbs}`}>
          <Link to="/" className={s.crumbLink}>
            Trang chủ
          </Link>
          <span className={s.crumbSep}>/</span>
          <Link to="/news" className={s.crumbLink}>
            Tin tức
          </Link>
          <span className={s.crumbSep}>/</span>
          <span className={s.crumbCurrent}>
            {article.title}
          </span>
        </div>
      </div>

      <div className={`fl-container-4xl ${s.container}`}>
        <div className={s.topRow}>
          <Link
            to="/news"
            className={s.listBack}
          >
            <ArrowLeft size={14} className={s.backIcon} />
            Quay lại danh sách
          </Link>
          <button className={s.shareBtn}>
            <Share2 size={18} />
          </button>
        </div>

        <div className={s.metaBlock}>
          <div className={s.metaRow}>
            <div className={s.metaDate}>
              <Calendar size={12} />
              {formatDate(article.createdAt)}
            </div>
            <div className={s.metaRead}>
              <Clock size={12} />5 phút đọc
            </div>
          </div>
          <h1 className={s.title}>
            {article.title}
          </h1>
          {article.excerpt && (
            <div className={s.excerptBox}>
              <p className={s.excerpt}>
                "{article.excerpt}"
              </p>
            </div>
          )}
        </div>

        {article.image && (
          <div className={s.imageWrap}>
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className={s.image}
            />
          </div>
        )}

        <div className="prose max-w-none">
          <div
            className={s.contentBody}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        <div className={s.footer}>
          <div className={s.author}>
            <p className={s.authorLabel}>
              Đăng bởi
            </p>
            <p className={s.authorName}>
              Ban biên tập FLY LABOUR
            </p>
          </div>
          <Link
            to="/news"
            className={s.footerBtn}
          >
            Khám phá tin khác <ArrowLeft size={16} className={s.arrowRev} />
          </Link>
        </div>
      </div>
    </div>
  );
}
