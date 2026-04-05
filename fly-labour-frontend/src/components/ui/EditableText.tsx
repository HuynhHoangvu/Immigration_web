import { useState, useRef, useEffect } from 'react'
import { Pencil, Check, X, Palette, ALargeSmall } from 'lucide-react'
import { useEditModeStore } from '@/store/editModeStore'
import { useContentStore } from '@/hooks/usePageContent'
import { useThemeStore } from '@/store/themeStore'

interface Props {
  settingKey: string
  defaultValue: string
  multiline?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
  colorEditable?: boolean
  sizeEditable?: boolean
}

const FONT_SIZES = [
  { label: 'xs',   value: '0.75rem' },
  { label: 'sm',   value: '0.875rem' },
  { label: 'base', value: '1rem' },
  { label: 'lg',   value: '1.125rem' },
  { label: 'xl',   value: '1.25rem' },
  { label: '2xl',  value: '1.5rem' },
  { label: '3xl',  value: '1.875rem' },
  { label: '4xl',  value: '2.25rem' },
  { label: '5xl',  value: '3rem' },
  { label: '6xl',  value: '3.75rem' },
]

export function EditableText({
  settingKey,
  defaultValue,
  multiline = false,
  className = '',
  as: Tag = 'span',
  colorEditable = true,
  sizeEditable = true,
}: Props) {
  const isEditMode  = useEditModeStore(s => s.isEditMode)
  const setChange   = useEditModeStore(s => s.setChange)
  const setStored   = useContentStore(s => s.set)
  const theme       = useThemeStore(s => s.theme)

  // Text value
  const storedValue = useContentStore(s => s.content[settingKey])
  // Per-theme colors (new format)
  const storedColorDark  = useContentStore(s => s.content[`${settingKey}__color__dark`])
  const storedColorLight = useContentStore(s => s.content[`${settingKey}__color__light`])
  // Legacy single color (fallback)
  const storedColorLegacy = useContentStore(s => s.content[`${settingKey}__color`])
  // Font size (theme-independent)
  const storedSize = useContentStore(s => s.content[`${settingKey}__size`])

  const currentValue      = storedValue ?? defaultValue
  const currentColorDark  = storedColorDark  ?? storedColorLegacy ?? ''
  const currentColorLight = storedColorLight ?? storedColorLegacy ?? ''
  const currentSize       = storedSize ?? ''

  // Active color based on current theme
  const activeColor = theme === 'dark' ? currentColorDark : currentColorLight

  const [editing, setEditing]             = useState(false)
  const [draft, setDraft]                 = useState(currentValue)
  const [draftColorDark, setDraftColorDark]   = useState(currentColorDark)
  const [draftColorLight, setDraftColorLight] = useState(currentColorLight)
  const [draftSize, setDraftSize]         = useState(currentSize)

  const inputRef    = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const colorDarkRef  = useRef<HTMLInputElement>(null)
  const colorLightRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(storedValue ?? defaultValue)  }, [storedValue, defaultValue])
  useEffect(() => { setDraftColorDark(storedColorDark  ?? storedColorLegacy ?? '') }, [storedColorDark,  storedColorLegacy])
  useEffect(() => { setDraftColorLight(storedColorLight ?? storedColorLegacy ?? '') }, [storedColorLight, storedColorLegacy])
  useEffect(() => { setDraftSize(storedSize ?? '') }, [storedSize])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const handleSave = () => {
    setStored(settingKey, draft)
    setChange(`content.${settingKey}`, draft)

    // Lưu màu dark
    setStored(`${settingKey}__color__dark`, draftColorDark)
    setChange(`content.${settingKey}__color__dark`, draftColorDark)
    // Lưu màu light
    setStored(`${settingKey}__color__light`, draftColorLight)
    setChange(`content.${settingKey}__color__light`, draftColorLight)
    // Xóa legacy key nếu có
    setStored(`${settingKey}__color`, '')
    setChange(`content.${settingKey}__color`, '')

    setStored(`${settingKey}__size`, draftSize)
    setChange(`content.${settingKey}__size`, draftSize)

    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(currentValue)
    setDraftColorDark(currentColorDark)
    setDraftColorLight(currentColorLight)
    setDraftSize(currentSize)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') handleCancel()
  }

  const textStyle: React.CSSProperties = {
    ...(activeColor ? { color: activeColor } : {}),
    ...(currentSize ? { fontSize: currentSize } : {}),
  }

  // ── Non-edit mode ─────────────────────────────────────────────
  if (!isEditMode) {
    return (
      <Tag className={className} style={Object.keys(textStyle).length ? textStyle : undefined}>
        {currentValue}
      </Tag>
    )
  }

  // ── Edit mode — đang gõ ───────────────────────────────────────
  if (editing) {
    return (
      <span className="inline-flex flex-col gap-1.5 relative">

        {/* Input text */}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="border-2 border-brand-gold rounded px-2 py-1 text-sm bg-gray-800 text-white resize-none min-w-[220px] focus:outline-none"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-2 border-brand-gold rounded px-2 py-1 text-sm bg-gray-800 text-white min-w-[180px] focus:outline-none"
          />
        )}

        {/* Toolbar */}
        <span className="flex flex-col gap-1.5 bg-gray-900/98 border border-white/10 rounded-xl px-3 py-2 shadow-xl min-w-[220px]">

          {/* Màu theo theme */}
          {colorEditable && (
            <span className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Palette size={9} /> Màu chữ theo theme
              </span>
              <span className="flex items-center gap-3">

                {/* Dark mode color */}
                <span className="flex items-center gap-1.5 flex-1 bg-gray-800 rounded-lg px-2 py-1">
                  <span className="text-[10px] text-gray-400">🌙 Dark</span>
                  <span
                    className="w-5 h-5 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform shadow shrink-0"
                    style={{
                      background: draftColorDark || 'transparent',
                      borderColor: draftColorDark ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                      backgroundImage: draftColorDark ? undefined : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23555'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23555'/%3E%3C/svg%3E\")",
                    }}
                    onClick={() => colorDarkRef.current?.click()}
                    title="Màu chữ trên nền tối"
                  />
                  {draftColorDark && (
                    <button onClick={() => setDraftColorDark('')} className="text-[10px] text-gray-500 hover:text-red-400">✕</button>
                  )}
                  <input ref={colorDarkRef} type="color"
                    value={draftColorDark || '#ffffff'}
                    onChange={e => setDraftColorDark(e.target.value)}
                    className="w-0 h-0 opacity-0 absolute pointer-events-none"
                  />
                </span>

                {/* Light mode color */}
                <span className="flex items-center gap-1.5 flex-1 bg-gray-100/10 rounded-lg px-2 py-1">
                  <span className="text-[10px] text-gray-400">☀️ Light</span>
                  <span
                    className="w-5 h-5 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform shadow shrink-0"
                    style={{
                      background: draftColorLight || 'transparent',
                      borderColor: draftColorLight ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                      backgroundImage: draftColorLight ? undefined : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23555'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23555'/%3E%3C/svg%3E\")",
                    }}
                    onClick={() => colorLightRef.current?.click()}
                    title="Màu chữ trên nền sáng"
                  />
                  {draftColorLight && (
                    <button onClick={() => setDraftColorLight('')} className="text-[10px] text-gray-500 hover:text-red-400">✕</button>
                  )}
                  <input ref={colorLightRef} type="color"
                    value={draftColorLight || '#111111'}
                    onChange={e => setDraftColorLight(e.target.value)}
                    className="w-0 h-0 opacity-0 absolute pointer-events-none"
                  />
                </span>
              </span>
            </span>
          )}

          {/* Font size */}
          {sizeEditable && (
            <span className="flex items-center gap-1.5">
              <ALargeSmall size={10} className="text-blue-400" />
              <span className="text-[10px] text-gray-400">Cỡ chữ:</span>
              <select
                value={draftSize}
                onChange={e => setDraftSize(e.target.value)}
                className="flex-1 text-[11px] bg-gray-800 text-white border border-white/20 rounded px-1.5 py-0.5 focus:outline-none focus:border-brand-gold"
              >
                <option value="">-- mặc định --</option>
                {FONT_SIZES.map(s => (
                  <option key={s.value} value={s.value}>{s.label} — {s.value}</option>
                ))}
              </select>
            </span>
          )}

          {/* Preview song song 2 theme */}
          <span className="flex flex-col gap-0.5">
            <span className="text-[9px] text-gray-600 uppercase tracking-widest">Preview</span>
            <span className="flex rounded-lg overflow-hidden border border-white/10 text-[12px]">
              {/* Dark bg preview */}
              <span
                className="flex-1 px-2 py-1.5 truncate text-center"
                style={{
                  background: '#111827',
                  color: draftColorDark || '#ffffff',
                  fontSize: draftSize || 'inherit',
                }}
              >
                {draft || defaultValue || 'Preview'}
              </span>
              {/* Light bg preview */}
              <span
                className="flex-1 px-2 py-1.5 truncate text-center border-l border-white/10"
                style={{
                  background: '#f9fafb',
                  color: draftColorLight || '#111827',
                  fontSize: draftSize || 'inherit',
                }}
              >
                {draft || defaultValue || 'Preview'}
              </span>
            </span>
            <span className="flex text-[9px] text-gray-600">
              <span className="flex-1 text-center">🌙 Dark mode</span>
              <span className="flex-1 text-center">☀️ Light mode</span>
            </span>
          </span>

          {/* Save / Cancel */}
          <span className="flex items-center gap-1 pt-1 border-t border-white/10">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors"
              title="Lưu (Enter)"
            >
              <Check size={12} /> Lưu
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-red-400 text-xs font-semibold transition-colors"
              title="Hủy (Esc)"
            >
              <X size={12} /> Hủy
            </button>
          </span>
        </span>
      </span>
    )
  }

  // ── Edit mode — idle (hover) ──────────────────────────────────
  const idleStyle: React.CSSProperties = {
    ...(activeColor ? { color: activeColor } : {}),
    ...(currentSize ? { fontSize: currentSize } : {}),
  }

  return (
    <span className="relative inline-flex items-center gap-1 group cursor-pointer" title="Click để chỉnh sửa">
      <Tag
        className={`${className} outline-dashed outline-1 outline-brand-gold/50 rounded px-0.5 group-hover:outline-brand-gold transition-all`}
        style={Object.keys(idleStyle).length ? idleStyle : undefined}
      >
        {currentValue}
      </Tag>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
        <button
          onClick={() => { setDraft(currentValue); setDraftColorDark(currentColorDark); setDraftColorLight(currentColorLight); setDraftSize(currentSize); setEditing(true) }}
          className="w-5 h-5 rounded bg-brand-gold text-black flex items-center justify-center shrink-0"
          title="Sửa text"
        >
          <Pencil size={10} />
        </button>
        <button
          onClick={() => { setDraft(currentValue); setDraftColorDark(currentColorDark); setDraftColorLight(currentColorLight); setDraftSize(currentSize); setEditing(true) }}
          className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center shrink-0"
          title="Đổi màu chữ"
        >
          <Palette size={10} />
        </button>
        <button
          onClick={() => { setDraft(currentValue); setDraftColorDark(currentColorDark); setDraftColorLight(currentColorLight); setDraftSize(currentSize); setEditing(true) }}
          className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0"
          title="Đổi cỡ chữ"
        >
          <ALargeSmall size={10} />
        </button>
        {(currentColorDark || currentColorLight) && (
          <span className="flex items-center gap-0.5">
            {currentColorDark  && <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: currentColorDark }}  title={`Dark: ${currentColorDark}`} />}
            {currentColorLight && <span className="w-3 h-3 rounded-full border border-black/20" style={{ background: currentColorLight }} title={`Light: ${currentColorLight}`} />}
          </span>
        )}
        {currentSize && (
          <span className="text-[9px] bg-blue-900/60 text-blue-300 px-1 rounded leading-tight">
            {FONT_SIZES.find(s => s.value === currentSize)?.label ?? currentSize}
          </span>
        )}
      </span>
    </span>
  )
}
