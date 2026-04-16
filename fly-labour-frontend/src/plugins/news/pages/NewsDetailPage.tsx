import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Share2, Clock } from "lucide-react";
import { newsApi, getImageUrl } from "@/core/services/api";
import { formatDate } from "@/core/utils/helpers";

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
      <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300 pt-28 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest">
            Đang tải bài viết...
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300 pt-28 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
            🔍
          </div>
          <h2 className="text-slate-900 dark:text-white font-bold text-xl mb-2">
            Không tìm thấy bài viết
          </h2>
          <p className="text-slate-500 dark:text-gray-300 text-sm mb-8 leading-relaxed">
            Nội dung bạn đang tìm kiếm có thể đã bị gỡ bỏ hoặc đường dẫn không
            chính xác.
          </p>
          <Link
            to="/news"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 font-bold text-sm"
          >
            <ArrowLeft size={16} /> Quay lại Tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark transition-colors duration-300 pt-20 pb-20">
      {/* Dynamic Breadcrumb */}
      <div className="bg-slate-50/50 dark:bg-brand-card/30 border-b border-slate-100 dark:border-white/5 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-300">
          <Link
            to="/"
            className="hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
          >
            Trang chủ
          </Link>
          <span className="opacity-30">/</span>
          <Link
            to="/news"
            className="hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
          >
            Tin tức
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xs uppercase">
            {article.title}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-10">
          <Link
            to="/news"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại danh sách
          </Link>
          <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-amber-600 dark:hover:text-brand-gold border border-slate-100 dark:border-transparent transition-all shadow-sm">
            <Share2 size={18} />
          </button>
        </div>

        {/* Article Meta */}
        <div className="mb-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-brand-gold/10 text-amber-600 dark:text-brand-gold rounded-full border border-amber-100 dark:border-transparent">
              <Calendar size={12} />
              {formatDate(article.createdAt)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />5 phút đọc
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.2] mb-8">
            {article.title}
          </h1>
          {article.excerpt && (
            <div className="relative p-6 md:p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border-l-[6px] border-amber-500 dark:border-brand-gold shadow-sm">
              <p className="text-slate-800 dark:text-gray-100 text-lg md:text-xl font-medium leading-relaxed italic">
                "{article.excerpt}"
              </p>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {article.image && (
          <div className="rounded-[2rem] overflow-hidden mb-12 shadow-2xl border border-slate-100 dark:border-white/5">
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Main Content Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div 
            className="text-slate-900 dark:text-gray-100 leading-[1.8] text-base md:text-lg font-medium"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Đăng bởi
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Ban biên tập FLY LABOUR
            </p>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 dark:shadow-amber-500/10"
          >
            Khám phá tin khác <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
