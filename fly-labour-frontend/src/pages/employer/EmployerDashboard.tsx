import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ClipboardList, Eye, TrendingUp, ArrowRight, Clock, UserCircle } from 'lucide-react'
import { employerApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { formatDate, getCountryLabels } from '@/utils/helpers'
import type { Job, Application } from '@/types'

const JOB_STATUS_VI: Record<string, { label: string; color: string }> = {
  active: { label: 'Ðang tuy?n', color: 'text-green-400' },
  draft:  { label: 'Nháp',       color: 'text-yellow-400' },
  paused: { label: 'T?m d?ng',   color: 'text-slate-900' },
  closed: { label: 'Ðã dóng',    color: 'text-red-400' },
}

export default function EmployerDashboard() {
  const { user } = useAuthStore()
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      employerApi.getMyJobs(),
      employerApi.getApplications(),
    ]).then(([jobsRes, appsRes]) => {
      setJobs(jobsRes.data.data || [])
      setApplications(appsRes.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0)
  const pendingApps = applications.filter(a => a.status === 'pending').length
  const recentApps = applications.slice(0, 5)
  const hasProfile = !!(user?.companyName && user?.companyDescription)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Xin chào, {user?.companyName || user?.fullName} ??</h1>
        <p className="text-brand-muted text-sm mt-1">T?ng quan ho?t d?ng tuy?n d?ng c?a doanh nghi?p b?n.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Tin dang dang',    value: loading ? '—' : jobs.filter(j => j.status === 'active').length, icon: Briefcase,     color: '#fdd52f' },
          { label: 'T?ng h? so',       value: loading ? '—' : applications.length,                            icon: ClipboardList, color: '#3B82F6' },
          { label: 'Ch? xét duy?t',    value: loading ? '—' : pendingApps,                                    icon: Clock,         color: '#F59E0B' },
          { label: 'Lu?t xem',          value: loading ? '—' : totalViews,                                     icon: Eye,           color: '#8B5CF6' },
        ].map(s => (
          <div key={s.label} className="card-dark p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}20` }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-brand-muted leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Jobs */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Tin tuy?n d?ng</h2>
            <Link to="/employer/jobs" className="text-xs text-brand-gold hover:text-brand-orange flex items-center gap-1">
              Xem t?t c? <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-brand-dark rounded-xl animate-pulse" />)}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-muted text-sm mb-3">Chua có tin tuy?n d?ng nào</p>
              <Link to="/employer/jobs" className="btn-primary text-sm px-4 py-2">Ðang tin d?u tiên</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.slice(0, 5).map(job => {
                const st = JOB_STATUS_VI[job.status] || { label: job.status, color: 'text-slate-900' }
                return (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-brand-dark rounded-xl">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{job.title}</p>
                      <p className="text-brand-muted text-xs">{getCountryLabels()[job.country]} · {job.slots || 0} ch? tiêu · {job.viewCount || 0} lu?t xem</p>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ml-2 ${st.color}`}>{st.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="card-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">H? so m?i nh?n</h2>
            <Link to="/employer/applications" className="text-xs text-brand-gold hover:text-brand-orange flex items-center gap-1">
              Xem t?t c? <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-brand-dark rounded-xl animate-pulse" />)}</div>
          ) : recentApps.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">Chua có h? so nào</p>
          ) : (
            <div className="space-y-2">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center gap-3 p-3 bg-brand-dark rounded-xl">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs shrink-0" style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{app.fullName}</p>
                    <p className="text-brand-muted text-xs truncate">{app.job?.title}</p>
                  </div>
                  <p className="text-brand-muted text-xs shrink-0">{formatDate(app.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile completion tip */}
      {!hasProfile && (
        <div className="card-dark p-5 border border-brand-gold/20 bg-brand-gold/5">
          <div className="flex items-start gap-3">
            <TrendingUp size={20} className="text-brand-gold shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Hoàn thi?n h? so công ty</p>
              <p className="text-brand-muted text-xs mt-1">Thêm mô t? công ty và website d? thu hút ?ng viên ch?t lu?ng hon.</p>
            </div>
            <Link to="/employer/profile" className="shrink-0 flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-orange font-medium">
              <UserCircle size={14} /> C?p nh?t
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
