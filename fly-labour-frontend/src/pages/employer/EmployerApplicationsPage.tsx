import { useState, useEffect } from 'react'
import { FileText, Search, ExternalLink, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import { employerApi, applicationsApi, getImageUrl } from '@/services/api'
import { APP_STATUS_LABELS, formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'
import type { Application } from '@/types'

const EMPLOYER_STATUS_OPTIONS = [
  { value: 'reviewing', label: 'Đang xem xét', icon: Clock, color: 'text-blue-400 border-blue-400/30 bg-blue-400/5' },
  { value: 'approved', label: 'Phê duyệt', icon: CheckCircle, color: 'text-green-400 border-green-400/30 bg-green-400/5' },
  { value: 'rejected', label: 'Từ chối', icon: XCircle, color: 'text-red-400 border-red-400/30 bg-red-400/5' },
]

export default function EmployerApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    employerApi.getApplications()
      .then(r => setApps(r.data || []))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (appId: string, status: string) => {
    setUpdatingId(appId)
    try {
      const res = await applicationsApi.employerUpdateStatus(appId, status)
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a))
      toast.success('Đã cập nhật trạng thái')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = apps.filter(a =>
    !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.job?.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Applications Received</h1>
        <p className="text-brand-muted text-sm">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or job title..."
          className="input-dark pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-brand-card rounded-2xl animate-pulse border border-brand-border" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-white font-semibold mb-1">{search ? 'No results found' : 'No applications yet'}</p>
          <p className="text-brand-muted text-sm">Applications will appear here once candidates apply to your jobs.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => {
            const status = APP_STATUS_LABELS[app.status]
            const isOpen = expanded === app.id
            return (
              <div key={app.id} className="card-dark border border-brand-border rounded-2xl overflow-hidden">
                {/* Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/2 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-black font-bold text-xs shrink-0" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{app.fullName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${status?.color}`}>{status?.label}</span>
                    </div>
                    <p className="text-brand-muted text-xs truncate">{app.email} · {app.job?.title}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-brand-muted text-xs hidden sm:block">{formatDate(app.createdAt)}</p>
                    {isOpen ? <ChevronUp size={15} className="text-brand-muted" /> : <ChevronDown size={15} className="text-brand-muted" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-brand-border p-4 space-y-3 bg-brand-dark/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {[
                        { label: 'Phone', value: app.phone },
                        { label: 'Date of Birth', value: app.dateOfBirth || '—' },
                        { label: 'Address', value: app.address || '—' },
                        { label: 'Education', value: app.education || '—' },
                        { label: 'Experience', value: app.experience || '—' },
                        { label: 'Language Level', value: app.languageLevel || '—' },
                      ].map(f => (
                        <div key={f.label}>
                          <p className="text-brand-muted text-xs">{f.label}</p>
                          <p className="text-white">{f.value}</p>
                        </div>
                      ))}
                    </div>

                    {app.coverLetter && (
                      <div>
                        <p className="text-brand-muted text-xs mb-1">Cover Letter</p>
                        <p className="text-white text-sm bg-brand-dark rounded-xl p-3 leading-relaxed">{app.coverLetter}</p>
                      </div>
                    )}

                    {app.cvUrl && (
                      <div>
                        <p className="text-brand-muted text-xs mb-1">CV / Resume</p>
                        <a
                          href={app.cvUrl.startsWith('http') ? app.cvUrl : `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'}${app.cvUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-brand-yellow hover:text-brand-orange text-sm transition-colors"
                        >
                          <FileText size={14} /> Xem CV <ExternalLink size={12} />
                        </a>
                      </div>
                    )}

                    {/* Status actions */}
                    {app.status !== 'withdrawn' && (
                      <div>
                        <p className="text-brand-muted text-xs mb-2">Cập nhật trạng thái</p>
                        <div className="flex flex-wrap gap-2">
                          {EMPLOYER_STATUS_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              disabled={app.status === opt.value || updatingId === app.id}
                              onClick={() => handleStatusChange(app.id, opt.value)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${app.status === opt.value ? opt.color + ' opacity-100' : 'border-brand-border text-brand-muted hover:border-white/20 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <opt.icon size={12} /> {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
