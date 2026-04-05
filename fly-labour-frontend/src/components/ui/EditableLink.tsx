import { useState, useRef, useEffect } from 'react'
import { Link2, Check, X, ExternalLink } from 'lucide-react'
import { useEditModeStore } from '@/store/editModeStore'
import { useContentStore } from '@/hooks/usePageContent'

interface Props {
  /** Key lưu URL vào DB, ví dụ: "social.facebook" */
  settingKey: string
  /** URL mặc định nếu DB chưa có */
  defaultValue: string
  /** Nội dung bên trong thẻ a (icon, text...) */
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  target?: string
  rel?: string
  /** Label mô tả, ví dụ: "Facebook URL" */
  label?: string
}

export function EditableLink({
  settingKey,
  defaultValue,
  children,
  className = '',
  style,
  target,
  rel,
  label,
}: Props) {
  const isEditMode = useEditModeStore(s => s.isEditMode)
  const setChange  = useEditModeStore(s => s.setChange)
  const storedUrl  = useContentStore(s => s.content[settingKey])
  const setStored  = useContentStore(s => s.set)

  const currentUrl = storedUrl ?? defaultValue
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(storedUrl ?? defaultValue) }, [storedUrl, defaultValue])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const handleSave = () => {
    const trimmed = draft.trim()
    setStored(settingKey, trimmed)
    setChange(`content.${settingKey}`, trimmed)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(currentUrl)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') handleCancel()
  }

  // Non-edit mode: render bình thường
  if (!isEditMode) {
    return (
      <a href={currentUrl} className={className} style={style} target={target} rel={rel}>
        {children}
      </a>
    )
  }

  // Edit mode — đang nhập URL
  if (editing) {
    return (
      <span className="inline-flex flex-col gap-1 relative">
        {/* Preview link cũ */}
        <span className="text-[10px] text-gray-500 truncate max-w-[220px]">
          {label || settingKey}
        </span>

        <span className="flex items-center gap-1">
          <span className="text-brand-gold shrink-0"><Link2 size={12} /></span>
          <input
            ref={inputRef}
            type="url"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://..."
            className="border-2 border-brand-gold rounded px-2 py-1 text-xs bg-gray-800 text-white min-w-[200px] focus:outline-none"
          />
          <button
            onClick={handleSave}
            className="w-6 h-6 rounded bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shrink-0"
            title="Lưu"
          >
            <Check size={11} />
          </button>
          <button
            onClick={handleCancel}
            className="w-6 h-6 rounded bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shrink-0"
            title="Hủy"
          >
            <X size={11} />
          </button>
        </span>

        {/* Preview URL đang nhập */}
        {draft && draft !== currentUrl && (
          <span className="text-[10px] text-green-400 truncate max-w-[220px]">
            → {draft}
          </span>
        )}
      </span>
    )
  }

  // Edit mode — idle: hiện link bình thường + icon chỉnh
  return (
    <span className="relative inline-flex items-center gap-1 group">
      <a
        href={currentUrl}
        className={`${className} outline-dashed outline-1 outline-brand-gold/40 rounded group-hover:outline-brand-gold transition-all`}
        style={style}
        target={target}
        rel={rel}
        onClick={e => e.preventDefault()} // Không navigate khi đang edit mode
      >
        {children}
      </a>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 absolute -top-7 left-0 z-50">
        <button
          onClick={() => { setDraft(currentUrl); setEditing(true) }}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-gold text-black text-[10px] font-semibold whitespace-nowrap shadow-lg"
          title={`Sửa link: ${label || settingKey}`}
        >
          <Link2 size={9} /> {label || 'Sửa link'}
        </button>
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center w-5 h-5 rounded bg-gray-700 text-white"
          title="Mở link hiện tại"
        >
          <ExternalLink size={9} />
        </a>
      </span>
    </span>
  )
}
