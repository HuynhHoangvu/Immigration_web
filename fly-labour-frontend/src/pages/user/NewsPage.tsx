import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, ArrowRight } from 'lucide-react'
import { newsApi, getImageUrl } from '@/services/api'
import { formatDate } from '@/utils/helpers'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  image: string
  isPublished: boolean
  createdAt: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    newsApi.getAll()
      .then(r => setNews(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = news.filter(n =>
    !search ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.excerpt || '').toLowerCase().includes(search.toLowerCase())
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="border-b border-brand-border bg-brand-card/30">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="section-title mb-3">
            Tin tức <span className="gradient-text">& Cập nhật</span>
          </h1>
          <p className="text-brand-muted max-w-xl mx-auto">
            Thông tin mới nhất về thị trường lao động quốc tế, chính sách visa và cơ hội việc làm
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="input-dark pl-10"
          />
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-dark rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-brand-dark" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-brand-dark rounded w-3/4" />
                  <div className="h-3 bg-brand-dark rounded w-full" />
                  <div className="h-3 bg-brand-dark rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-white font-semibold mb-1">
              {search ? 'Không tìm thấy bài viết' : 'Chưa có bài viết nào'}
            </p>
            <p className="text-brand-muted text-sm">Hãy quay lại sau nhé!</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link to={`/news/${featured.slug}`} className="group block">
                <div className="card-dark overflow-hidden rounded-2xl md:grid md:grid-cols-2 hover:border-brand-gold/30 transition-colors border border-brand-border">
                  <div className="relative h-56 md:h-full overflow-hidden bg-brand-dark">
                    {featured.image ? (
                      <img
                        src={getImageUrl(featured.image)}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">📰</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-card/20" />
                    <span className="absolute top-4 left-4 bg-brand-gold text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                      Nổi bật
                    </span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-brand-muted text-xs mb-3">
                      <Calendar size={12} />
                      {formatDate(featured.createdAt)}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-brand-muted text-sm leading-relaxed line-clamp-3 mb-5">
                        {featured.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-brand-gold text-sm font-medium group-hover:gap-3 transition-all">
                      Đọc tiếp <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Other articles */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(article => (
                  <Link
                    key={article.id}
                    to={`/news/${article.slug}`}
                    className="group card-dark rounded-2xl overflow-hidden hover:border-brand-gold/30 transition-colors border border-brand-border flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden bg-brand-dark">
                      {article.image ? (
                        <img
                          src={getImageUrl(article.image)}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">📰</div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-brand-muted text-xs mb-2">
                        <Calendar size={11} />
                        {formatDate(article.createdAt)}
                      </div>
                      <h3 className="text-white font-semibold mb-2 group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-brand-muted text-sm line-clamp-2 leading-relaxed flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-brand-gold text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                        Đọc tiếp <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
