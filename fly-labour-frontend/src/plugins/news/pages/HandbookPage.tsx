import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { newsApi, getImageUrl } from "@/core/services/api";
import { formatDate } from "@/core/utils/helpers";
import { EditableSection } from "@/admin/components/EditableSection";
import { EditableText } from "@/admin/components/EditableText";

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
    // For now, we use the same news API but we could filter by category if the backend supported it.
    // Or we filter by keywords in title for "Handbook/Cẩm nang"
    newsApi
      .getAll()
      .then((r) => {
        const all = r.data || [];
        // Optional: Filter for handbook items specifically if needed
        setItems(all);
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

  const cardClasses =
    "bg-white dark:bg-brand-card rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-brand-gold/10 hover:border-brand-gold/50 transition-all duration-500";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] transition-colors duration-300 pt-20 pb-20">
      {/* Page Header */}
      <EditableSection
        sectionKey="page.handbook.header"
        className="bg-slate-50/50 dark:bg-brand-card/30 backdrop-blur-xl border-b border-slate-100 dark:border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-8 shadow-sm">
            <BookOpen
              size={14}
              className="text-brand-gold"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              Cẩm nang định cư & Visa
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
            <EditableText
              settingKey="handbook.title"
              defaultValue="Cẩm nang FLY LABOUR"
              className="gradient-text"
            />
          </h1>
          <p className="text-slate-500 dark:text-brand-muted max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
            <EditableText
              settingKey="handbook.subtitle"
              defaultValue="Toàn bộ kinh nghiệm, quy trình và những lưu ý quan trọng khi bắt đầu hành trình vươn tầm thế giới."
              colorEditable={false}
              sizeEditable={false}
            />
          </p>
        </div>
      </EditableSection>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-gold transition-colors"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tài liệu, hướng dẫn..."
            className="w-full h-16 pl-14 pr-8 text-base font-medium rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-brand-gold outline-none shadow-inner transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-brand-gold mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Đang tra cứu cẩm nang...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 max-w-3xl mx-auto">
            <div className="text-6xl mb-6">📚</div>
            <p className="text-slate-900 dark:text-white font-black text-2xl mb-2">
              Không tìm thấy nội dung
            </p>
            <p className="text-slate-500 dark:text-brand-muted font-medium">
              Bạn có thể thử tìm kiếm theo tên quốc gia hoặc loại visa.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.slug}`}
                className={`group ${cardClasses} flex flex-col hover:-translate-y-2 transition-transform`}
              >
                <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-brand-dark">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">
                      📖
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                     <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        Đọc tài liệu <ArrowRight size={14} />
                     </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1 bg-white dark:bg-brand-card">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Calendar size={12} className="text-brand-gold" />
                    {formatDate(item.createdAt)}
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-black text-xl mb-4 group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight tracking-tight">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-slate-500 dark:text-brand-muted text-sm leading-relaxed line-clamp-3 flex-1 font-medium">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                     <BookOpen size={16} className="text-brand-gold opacity-50" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-gold transition-colors">
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
