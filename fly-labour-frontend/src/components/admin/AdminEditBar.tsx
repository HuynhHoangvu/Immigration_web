import { useState } from 'react'
import { Pencil, Save, X, Loader2, CheckCircle, Palette } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useEditModeStore } from '@/store/editModeStore'
import { useContentStore } from '@/hooks/usePageContent'
import { settingsApi } from '@/services/api'
import toast from 'react-hot-toast'

export function AdminEditBar() {
  const { user } = useAuthStore()
  const { isEditMode, pendingChanges, toggle, disable, clearChanges } = useEditModeStore()
  const loadContent = useContentStore(s => s.load)
  const [saving, setSaving] = useState(false)

  // Chỉ hiện với admin
  if (user?.role !== 'admin') return null

  const changeCount = Object.keys(pendingChanges).length

  const handleSave = async () => {
    if (changeCount === 0) {
      toast('Không có thay đổi nào để lưu', { icon: 'ℹ️' })
      return
    }
    setSaving(true)
    try {
      await settingsApi.save(pendingChanges)
      clearChanges()
      await loadContent()
      toast.success(`Đã lưu ${changeCount} thay đổi!`)
      disable()
    } catch {
      toast.error('Lưu thất bại, thử lại!')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    if (changeCount > 0 && !confirm(`Hủy ${changeCount} thay đổi chưa lưu?`)) return
    clearChanges()
    loadContent() // Reload từ DB để reset preview
    disable()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2">
      {!isEditMode ? (
        /* Nút bật edit mode */
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-gold text-black font-semibold text-sm shadow-lg shadow-brand-gold/30 hover:scale-105 transition-transform"
        >
          <Pencil size={15} />
          Chỉnh sửa trang
        </button>
      ) : (
        /* Toolbar khi đang edit */
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900/95 backdrop-blur border border-brand-gold/30 shadow-2xl">
          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pr-2 border-r border-white/10">
            <Palette size={13} className="text-brand-gold" />
            <span className="text-white font-medium">Đang chỉnh sửa</span>
            {changeCount > 0 && (
              <span className="bg-brand-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {changeCount} thay đổi
              </span>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || changeCount === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              changeCount > 0
                ? 'bg-green-500 hover:bg-green-400 text-white'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Lưu tất cả
          </button>

          {/* Discard */}
          <button
            onClick={handleDiscard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-all"
          >
            <X size={12} />
            Hủy
          </button>

          {/* Hint */}
          <span className="text-[10px] text-gray-500 pl-2 border-l border-white/10 hidden sm:block">
            Click vào text để sửa
          </span>
        </div>
      )}
    </div>
  )
}
