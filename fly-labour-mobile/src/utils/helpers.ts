import type { JobType, AppStatus } from '@/types'
import { Colors } from '@/constants/colors'

export const COUNTRY_MAP: Record<string, string> = {
  australia:   '🇦🇺 Úc (Australia)',
  canada:      '🇨🇦 Canada',
  new_zealand: '🇳🇿 New Zealand',
  norway:      '🇳🇴 Na Uy',
  germany:     '🇩🇪 Đức',
  portugal:    '🇵🇹 Bồ Đào Nha',
  czech:       '🇨🇿 Séc',
  us:          '🇺🇸 Mỹ',
  uk:          '🇬🇧 Anh',
  japan:       '🇯🇵 Nhật Bản',
  singapore:   '🇸🇬 Singapore',
  south_korea: '🇰🇷 Hàn Quốc',
  taiwan:      '🇹🇼 Đài Loan',
  uae:         '🇦🇪 UAE',
}

export function getCountryLabel(country: string): string {
  return COUNTRY_MAP[country] ?? country
}

export const JOBTYPE_LABELS: Record<JobType, string> = {
  full_time: 'Toàn thời gian',
  part_time: 'Bán thời gian',
  contract:  'Hợp đồng',
  seasonal:  'Theo mùa vụ',
}

export const APP_STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Chờ xét duyệt', color: Colors.appPending,   bg: '#d2992220' },
  reviewing: { label: 'Đang xem xét',  color: Colors.appReviewing, bg: '#58a6ff20' },
  approved:  { label: 'Đã chấp nhận',  color: Colors.appApproved,  bg: '#3fb95020' },
  rejected:  { label: 'Bị từ chối',    color: Colors.appRejected,  bg: '#f8514920' },
  withdrawn: { label: 'Đã rút lại',    color: Colors.appWithdrawn, bg: '#8b949e20' },
}

export function formatSalary(min?: number, max?: number, currency = 'AUD'): string {
  if (!min && !max) return 'Thương lượng'
  if (min && max) return `${min.toLocaleString()} – ${max.toLocaleString()} ${currency}/tháng`
  if (min) return `Từ ${min.toLocaleString()} ${currency}/tháng`
  return `Đến ${max?.toLocaleString()} ${currency}/tháng`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`
  return `${Math.floor(days / 30)} tháng trước`
}

export function getImageUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'
  return `${base}/${path}`
}
