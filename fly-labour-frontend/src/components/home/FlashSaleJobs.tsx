import { useState, useEffect, useRef } from 'react'
import { Flame, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import JobCard from '@/components/jobs/JobCard'
import { jobsApi } from '@/services/api'
import { useT } from '@/hooks/useT'
import type { Job } from '@/types'

function Countdown() {
  const [time, setTime] = useState({ h: 23, m: 59, s: 47 })
  const { t } = useT()
  const h = t('home')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return { h: 23, m: 59, s: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-1.5">
      <Clock size={14} className="text-brand-orange" />
      <span className="text-brand-muted text-xs">{h.endsIn}</span>
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="bg-brand-orange text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">{pad(v)}</span>
          {i < 2 && <span className="text-brand-orange font-bold text-xs">:</span>}
        </span>
      ))}
    </div>
  )
}

export default function FlashSaleJobs() {
  const [hotJobs, setHotJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    jobsApi.getHot()
      .then(res => setHotJobs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-red-600 rounded-2xl px-4 py-2 shadow-lg shadow-brand-orange/30">
              <Flame size={18} className="text-white animate-pulse" />
              <span className="font-display text-xl text-white tracking-wider">FLASH JOBS</span>
              <Flame size={18} className="text-white animate-pulse" />
            </div>
            <Countdown />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-xl border border-brand-border bg-brand-card flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-yellow/50 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-xl border border-brand-border bg-brand-card flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-yellow/50 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-none w-72 h-52 bg-brand-card rounded-2xl animate-pulse border border-brand-border" />
            ))}
          </div>
        ) : (
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {hotJobs.map((job) => (
              <div key={job.id} className="flex-none w-72 snap-start">
                <JobCard job={job} compact />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-brand-orange/40 to-transparent" />
      </div>
    </section>
  )
}
