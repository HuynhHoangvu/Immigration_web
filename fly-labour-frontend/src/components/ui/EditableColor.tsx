import { useRef } from 'react'
import { Palette } from 'lucide-react'
import { useEditModeStore } from '@/store/editModeStore'
import { useContentStore } from '@/hooks/usePageContent'

interface Props {
  /** Key duy nhất, ví dụ: "brand.primaryColor" */
  settingKey: string
  /** Màu mặc định dạng hex, ví dụ: "#e4a808" */
  defaultValue: string
  /** CSS variable cần update real-time, ví dụ: "--accent-primary" */
  cssVar?: string
  /** Label hiển thị khi hover */
  label?: string
}

export function EditableColor({ settingKey, defaultValue, cssVar, label }: Props) {
  const isEditMode = useEditModeStore(s => s.isEditMode)
  const setChange = useEditModeStore(s => s.setChange)
  const storedValue = useContentStore(s => s.content[settingKey])
  const setStored = useContentStore(s => s.set)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentColor = storedValue ?? defaultValue

  const handleChange = (color: string) => {
    setStored(settingKey, color)
    setChange(`content.${settingKey}`, color)
    // Update CSS variable real-time
    if (cssVar) {
      document.documentElement.style.setProperty(cssVar, color)
    }
  }

  if (!isEditMode) return null

  return (
    <div className="inline-flex items-center gap-1.5 group cursor-pointer" title={label || 'Chỉnh màu'}>
      <div
        className="w-5 h-5 rounded-full border-2 border-white/50 shadow-sm group-hover:scale-110 transition-transform"
        style={{ background: currentColor }}
        onClick={() => inputRef.current?.click()}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded"
      >
        <Palette size={10} />
        {label || 'Màu'}
      </button>
      <input
        ref={inputRef}
        type="color"
        value={currentColor}
        onChange={e => handleChange(e.target.value)}
        className="w-0 h-0 opacity-0 absolute"
      />
    </div>
  )
}
