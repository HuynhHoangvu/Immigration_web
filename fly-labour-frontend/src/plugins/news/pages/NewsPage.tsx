import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, ArrowRight, Newspaper, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@/core/services/api";
import { formatDate } from "@/core/utils/helpers";

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

  // Hệ thống Class đồng bộ (Bỏ card-dark, dùng màu trực tiếp)
  const cardClasses =
    "bg-white dark:bg-brand-card rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-brand-gold/5 hover:border-amber-400 dark:hover:border-brand-gold/50 transition-all duration-500";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300 pt-20 pb-20">
      {/* Page Header - Kính mờ trên nền trắng */}
      <div className="bg-slate-50/50 dark:bg-brand-card/30 backdrop-blur-xl border-b border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-brand-gold/10 border border-amber-100 dark:border-brand-gold/20 mb-8 shadow-sm">
            <Newspaper
              size={14}
              className="text-amber-600 dark:text-brand-gold"
            />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-brand-gold">
              Tạp chí FLY LABOUR
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
            <span className="gradient-text">Tin tức & Cập nhật</span>
          </h1>
          <p className="text-slate-800 dark:text-gray-200 max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
            Nơi cập nhật những thay đổi mới nhất về chính sách di trú và thị
            trường nhân lực toàn cầu.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Search Bar - Tối giản & Hiện đại */}
        <div className="relative max-w-2xl mx-auto group">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bạn muốn tìm hiểu thông tin gì?"
            className="w-full h-16 pl-14 pr-8 text-base font-medium rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 outline-none shadow-inner transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-amber-500 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Đang tải bản tin...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🏜️</div>
            <p className="text-slate-900 dark:text-white font-black text-2xl mb-2">
              Không tìm thấy bài viết
            </p>
            <p className="text-slate-800 dark:text-gray-200 font-medium">
              Thử tìm kiếm với một từ khóa khác nhé!
            </p>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Featured Section */}
            {featured && (
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                    Tiêu điểm hôm nay
                  </h2>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                </div>

                <Link to={`/news/${featured.slug}`} className="group block">
                  <div
                    className={`${cardClasses} md:grid md:grid-cols-2 flex flex-col min-h-[450px]`}
                  >
                    <div className="relative h-72 md:h-full overflow-hidden bg-slate-100 dark:bg-brand-dark">
                      {featured.image ? (
                        <img
                          src={getImageUrl(featured.image)}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-8xl grayscale opacity-20">
                          📰
                        </div>
                      )}
                      <div className="absolute top-8 left-8 bg-slate-900/80 backdrop-blur-md text-white dark:bg-brand-gold dark:text-amber-900 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl">
                        🔥 Trending
                      </div>
                    </div>
                    <div className="p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-brand-card">
                      <div className="flex items-center gap-3 text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-wider mb-8">
                        <Calendar size={14} className="text-amber-500" />
                        {formatDate(featured.createdAt)}
                      </div>
                      <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors leading-[1.1] tracking-tighter">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-slate-800 dark:text-gray-200 text-sm md:text-lg leading-relaxed line-clamp-4 mb-10 font-medium">
                          {featured.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-3 text-amber-600 dark:text-brand-gold font-black uppercase text-xs tracking-widest group-hover:gap-5 transition-all">
                        Khám phá chi tiết <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* List Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {rest.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className={`group ${cardClasses} flex flex-col`}
                >
                  <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-brand-dark">
                    {article.image ? (
                      <img
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">
                        📰
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-white dark:bg-brand-card">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-4">
                      <Calendar size={12} className="text-amber-500" />
                      {formatDate(article.createdAt)}
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-4 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-slate-800 dark:text-gray-200 text-xs leading-relaxed line-clamp-3 flex-1 font-medium italic">
                        "{article.excerpt}"
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50 dark:border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-brand-gold group-hover:translate-x-2 transition-transform">
                        Đọc tiếp
                      </span>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all shadow-sm">
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
