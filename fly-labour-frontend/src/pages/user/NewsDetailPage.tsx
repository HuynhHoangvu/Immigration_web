import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { newsApi, getImageUrl } from '@/services/api'
import { formatDate } from '@/utils/helpers'

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  createdAt: string
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    newsApi.getOne(slug)
      .then(r => setArticle(r.data))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white font-semibold mb-4">Không tìm thấy bài viết</p>
          <Link to="/news" className="btn-primary text-sm px-5 py-2">Quay lại Tin tức</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Breadcrumb */}
      <div className="border-b border-brand-border bg-brand-card/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-brand-muted">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/news" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tin tức</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-slate-900 dark:hover:text-white transition-colors mb-6">
          <ArrowLeft size={15} /> Quay lại Tin tức
        </Link>

        {/* Hero image */}
        {article.image && (
          <div className="rounded-2xl overflow-hidden mb-8 h-72 md:h-96 bg-brand-dark">
            <img
              src={getImageUrl(article.image)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & meta */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 text-brand-muted text-sm mb-4">
            <Calendar size={14} />
            {formatDate(article.createdAt)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-brand-muted text-lg leading-relaxed border-l-4 border-brand-gold pl-4">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Content */}
        {article.content && (
          <div className="card-dark p-8">
            <div className="prose prose-invert max-w-none text-slate-900 leading-relaxed whitespace-pre-line text-sm">
              {article.content}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-brand-border">
          <Link to="/news" className="btn-outline inline-flex items-center gap-2 px-6 py-3">
            <ArrowLeft size={15} /> Xem tất cả tin tức
          </Link>
        </div>
      </div>
    </div>
  )
}
