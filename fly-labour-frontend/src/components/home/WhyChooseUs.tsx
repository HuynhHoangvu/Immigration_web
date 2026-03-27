import { Shield, Globe, Clock, HeartHandshake } from 'lucide-react'
import { useT } from '@/hooks/useT'

const FEATURE_ICONS = [
  <Shield size={24} />,
  <Globe size={24} />,
  <Clock size={24} />,
  <HeartHandshake size={24} />,
]

export default function WhyChooseUs() {
  const { t } = useT()
  const h = t('home')

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {h.statsValues.map((val: string, i: number) => (
            <div key={i} className="card-dark p-6 text-center group hover:border-brand-yellow/30 transition-all duration-300">
              <div className="text-4xl mb-2">{h.statsIcons[i]}</div>
              <p className="font-display text-4xl gradient-text mb-1">{val}</p>
              <p className="text-brand-muted text-sm">{h.statsLabels[i]}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-3">{h.whyBadge}</p>
            <h2 className="section-title mb-5">
              {h.whyTitle}<br />
              <span className="gradient-text">{h.whyTitleAccent}</span>{' '}{h.whySubtitle}
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">{h.whyDesc}</p>
            <div className="flex gap-3">
              <a href="/jobs" className="btn-primary text-sm">{h.findJob}</a>
              <a href="/contact" className="btn-outline text-sm">{h.freeConsult}</a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {h.featureTitles.map((title: string, i: number) => (
              <div key={i} className="card-dark p-5 group hover:border-brand-yellow/30 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow mb-4 group-hover:bg-brand-yellow/20 transition-colors">
                  {FEATURE_ICONS[i]}
                </div>
                <h4 className="font-semibold text-white text-sm mb-2">{title}</h4>
                <p className="text-brand-muted text-xs leading-relaxed">{h.featureDescs[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
