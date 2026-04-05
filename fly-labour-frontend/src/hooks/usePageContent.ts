import { create } from 'zustand'
import { settingsApi } from '@/services/api'

// Store lưu content override từ DB
interface ContentStore {
  content: Record<string, string>
  loaded: boolean
  load: () => Promise<void>
  get: (key: string, fallback?: string) => string
  set: (key: string, value: string) => void
}

export const useContentStore = create<ContentStore>((set, get) => ({
  content: {},
  loaded: false,

  load: async () => {
    try {
      const res = await settingsApi.getAll()
      const data: Record<string, string> = res.data || {}
      // Lọc chỉ lấy content.* keys
      const contentData: Record<string, string> = {}
      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('content.')) {
          contentData[k.replace('content.', '')] = v
        }
      })
      set({ content: contentData, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  get: (key, fallback = '') => {
    return get().content[key] ?? fallback
  },

  set: (key, value) => {
    set(s => ({ content: { ...s.content, [key]: value } }))
  },
}))

// Hook tiện dùng
export function usePageContent(key: string, fallback = '') {
  const storeValue = useContentStore(s => s.content[key])
  return storeValue !== undefined ? storeValue : fallback
}
