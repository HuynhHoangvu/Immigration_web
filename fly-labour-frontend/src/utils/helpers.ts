import type { JobType, AppStatus } from '@/types'
import { useLangStore } from '@/store/langStore'
import { translations } from '@/i18n/translations'

function getLang() {
  return useLangStore.getState().lang
}

function getDict() {
  return translations[getLang()]
}

// Dynamic country map — respects current language
export function getCountryLabels(): Record<string, string> {
  const map = getDict().countryMap
  return new Proxy(map as Record<string, string>, {
    get: (target, key: string) => target[key] ?? key,
  })
}

// Static country map (English) used for flag emojis & values
const COUNTRY_MAP_EN: Record<string, string> = {
  australia:   '🇦🇺 Australia',
  canada:      '🇨🇦 Canada',
  new_zealand: '🇳🇿 New Zealand',
  norway:      '🇳🇴 Norway',
  germany:     '🇩🇪 Germany',
  portugal:    '🇵🇹 Portugal',
  czech:       '🇨🇿 Czech Republic',
  us:          '🇺🇸 United States',
  uk:          '🇬🇧 United Kingdom',
  japan:       '🇯🇵 Japan',
  singapore:   '🇸🇬 Singapore',
  south_korea: '🇰🇷 South Korea',
  taiwan:      '🇹🇼 Taiwan',
  uae:         '🇦🇪 UAE',
}

// COUNTRY_LABELS: legacy compat — static EN version
export const COUNTRY_LABELS: Record<string, string> = new Proxy(COUNTRY_MAP_EN, {
  get: (target, key: string) => target[key] ?? key,
})

// Ordered list for dropdowns — respects current language
export function getCountriesList() {
  const map = getDict().countryMap as Record<string, string>
  return Object.entries(COUNTRY_MAP_EN).map(([value]) => ({
    value,
    label: map[value] ?? COUNTRY_MAP_EN[value],
  }))
}

// Legacy static export for compat
export const COUNTRIES_LIST = Object.entries(COUNTRY_MAP_EN).map(([value, label]) => ({ value, label }))

export function getJobTypeLabel(type: JobType): string {
  return getDict().jobType[type] ?? type
}

export const JOBTYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract:  'Contract',
  seasonal:  'Seasonal',
}

export const APP_STATUS_LABELS: Record<AppStatus, { label: string; color: string }> = {
  pending:   { label: 'Pending Review',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  reviewing: { label: 'Under Review',    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  approved:  { label: 'Approved',        color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  rejected:  { label: 'Rejected',        color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  withdrawn: { label: 'Withdrawn',       color: 'text-slate-900 bg-gray-400/10 border-gray-400/20' },
}

export function getAppStatusLabel(status: AppStatus): { label: string; color: string } {
  const s = getDict().appStatus
  const colors: Record<AppStatus, string> = {
    pending:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    reviewing: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    approved:  'text-green-400 bg-green-400/10 border-green-400/20',
    rejected:  'text-red-400 bg-red-400/10 border-red-400/20',
    withdrawn: 'text-slate-900 bg-gray-400/10 border-gray-400/20',
  }
  return { label: s[status] ?? status, color: colors[status] }
}

export function formatSalary(min?: number, max?: number, currency = 'AUD') {
  const s = getDict().salary
  if (!min && !max) return s.negotiable
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency} ${s.perMonth}`
  if (min) return `${s.from} ${min.toLocaleString()} ${currency} ${s.perMonth}`
  return `${s.upTo} ${max?.toLocaleString()} ${currency} ${s.perMonth}`
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const t = getDict().time
  if (days === 0) return t.today
  if (days === 1) return t.yesterday
  if (days < 7) return `${days} ${t.daysAgo}`
  if (days < 30) return `${Math.floor(days / 7)} ${t.weeksAgo}`
  return `${Math.floor(days / 30)} ${t.monthsAgo}`
}

export function clsx(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}
