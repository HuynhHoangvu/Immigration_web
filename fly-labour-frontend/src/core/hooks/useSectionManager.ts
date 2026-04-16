import { arrayMove } from '@dnd-kit/sortable'
import { useEditModeStore } from '@/core/store/editModeStore'
import { useContentStore } from '@/core/hooks/usePageContent'

export interface SectionDef {
  id: string
  label: string
  icon: string
  /** Không thể ẩn hoặc di chuyển */
  required?: boolean
}

export const HOME_SECTIONS: SectionDef[] = [
  { id: 'hero',       label: 'Hero Banner',                icon: '🖼️', required: true },
  { id: 'flashsale',  label: 'Flash Sale Jobs',            icon: '⚡' },
  { id: 'categories', label: 'Danh mục việc làm',          icon: '📂' },
  { id: 'latestjobs', label: 'Việc làm mới nhất',          icon: '💼' },
  { id: 'why',        label: 'Tại sao chọn chúng tôi',     icon: '✅' },
  { id: 'employer',   label: 'Dành cho nhà tuyển dụng',    icon: '🏢' },
  { id: 'news',        label: 'Tin tức',                    icon: '📰' },
  { id: 'englishtest', label: 'Test tiếng Anh miễn phí',   icon: '📝' },
  { id: 'cta',         label: 'Call to Action',             icon: '🚀' },
]

const DEFAULT_ORDER = HOME_SECTIONS.map(s => s.id)

function parseJsonSafe<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

export function useSectionManager() {
  const setChange = useEditModeStore(s => s.setChange)
  const setStored = useContentStore(s => s.set)
  const storedOrder  = useContentStore(s => s.content['page.home.order'])
  const storedHidden = useContentStore(s => s.content['page.home.hidden'])
  const storedBg     = useContentStore(s => s.content['page.home.bg'])

  // Đảm bảo tất cả sections đều có trong order (phòng trường hợp thêm section mới)
  const savedOrder = parseJsonSafe<string[]>(storedOrder, DEFAULT_ORDER)
  const order = [
    ...savedOrder.filter(id => HOME_SECTIONS.some(s => s.id === id)),
    ...DEFAULT_ORDER.filter(id => !savedOrder.includes(id)),
  ]

  const hidden: string[] = parseJsonSafe(storedHidden, [])
  const bgMap: Record<string, string> = parseJsonSafe(storedBg, {})

  const _saveOrder = (newOrder: string[]) => {
    const json = JSON.stringify(newOrder)
    setStored('page.home.order', json)
    setChange('content.page.home.order', json)
  }

  const _saveHidden = (newHidden: string[]) => {
    const json = JSON.stringify(newHidden)
    setStored('page.home.hidden', json)
    setChange('content.page.home.hidden', json)
  }

  const _saveBg = (newBg: Record<string, string>) => {
    const json = JSON.stringify(newBg)
    setStored('page.home.bg', json)
    setChange('content.page.home.bg', json)
  }

  /** Kéo thả: activeId sang vị trí của overId */
  const reorder = (activeId: string, overId: string) => {
    if (activeId === overId) return
    const oldIndex = order.indexOf(activeId)
    const newIndex = order.indexOf(overId)
    if (oldIndex === -1 || newIndex === -1) return
    _saveOrder(arrayMove(order, oldIndex, newIndex))
  }

  /** Ẩn / hiện một section */
  const toggleHidden = (id: string) => {
    const def = HOME_SECTIONS.find(s => s.id === id)
    if (def?.required) return
    const newHidden = hidden.includes(id)
      ? hidden.filter(h => h !== id)
      : [...hidden, id]
    _saveHidden(newHidden)
  }

  /** Đặt màu nền cho section ('' = xóa màu) */
  const setBgColor = (id: string, color: string) => {
    const newBg = { ...bgMap }
    if (color) newBg[id] = color
    else delete newBg[id]
    _saveBg(newBg)
  }

  const isHidden  = (id: string) => hidden.includes(id)
  const getBgColor = (id: string) => bgMap[id] ?? ''

  return { order, isHidden, toggleHidden, reorder, setBgColor, getBgColor }
}
