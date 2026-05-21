import type { JobType, AppStatus } from '@core/types'
import { useLangStore } from '@core/store/langStore'
import { translations } from '@core/i18n/translations'

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
  pending:   { label: 'Pending Review',  color: 'app-status app-status--pending' },
  reviewing: { label: 'Under Review',    color: 'app-status app-status--reviewing' },
  approved:  { label: 'Approved',        color: 'app-status app-status--approved' },
  rejected:  { label: 'Rejected',        color: 'app-status app-status--rejected' },
  withdrawn: { label: 'Withdrawn',       color: 'app-status app-status--withdrawn' },
}

export function getAppStatusLabel(status: AppStatus): { label: string; color: string } {
  const s = getDict().appStatus
  const colors: Record<AppStatus, string> = {
    pending:   'app-status app-status--pending',
    reviewing: 'app-status app-status--reviewing',
    approved:  'app-status app-status--approved',
    rejected:  'app-status app-status--rejected',
    withdrawn: 'app-status app-status--withdrawn',
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
