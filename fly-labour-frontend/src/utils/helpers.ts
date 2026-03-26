import type { JobType, AppStatus } from '@/types'

const COUNTRY_MAP: Record<string, string> = {
  australia:   '🇦🇺 Úc',
  canada:      '🇨🇦 Canada',
  new_zealand: '🇳🇿 New Zealand',
  norway:      '🇳🇴 Na Uy',
  germany:     '🇩🇪 Đức',
  portugal:    '🇵🇹 Bồ Đào Nha',
  czech:       '🇨🇿 Séc',
  us:          '🇺🇸 Mỹ',
  uk:          '🇬🇧 Anh Quốc',
  japan:       '🇯🇵 Nhật Bản',
  singapore:   '🇸🇬 Singapore',
  south_korea: '🇰🇷 Hàn Quốc',
  taiwan:      '🇹🇼 Đài Loan',
  uae:         '🇦🇪 UAE',
}

// Trả về label nếu có trong danh sách, ngược lại trả về chính giá trị đó
export const COUNTRY_LABELS: Record<string, string> = new Proxy(COUNTRY_MAP, {
  get: (target, key: string) => target[key] ?? key,
})

export const JOBTYPE_LABELS: Record<JobType, string> = {
  full_time: 'Toàn thời gian',
  part_time: 'Bán thời gian',
  contract: 'Hợp đồng',
  seasonal: 'Theo mùa vụ',
}

export const APP_STATUS_LABELS: Record<AppStatus, { label: string; color: string }> = {
  pending:   { label: 'Chờ xét duyệt', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  reviewing: { label: 'Đang xem xét',  color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  approved:  { label: 'Đã duyệt',      color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  rejected:  { label: 'Từ chối',       color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  withdrawn: { label: 'Rút hồ sơ',     color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
}

export function formatSalary(min?: number, max?: number, currency = 'AUD') {
  if (!min && !max) return 'Thỏa thuận'
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}/tháng`
  if (min) return `Từ ${min.toLocaleString()} ${currency}/tháng`
  return `Đến ${max?.toLocaleString()} ${currency}/tháng`
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`
  return `${Math.floor(days / 30)} tháng trước`
}

export function clsx(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}
