import { useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Palette } from 'lucide-react'
import { useEditModeStore } from '@/store/editModeStore'
import { useSectionManager, HOME_SECTIONS } from '@/hooks/useSectionManager'

interface Props {
  id: string
  children: React.ReactNode
}

export function DraggableSection({ id, children }: Props) {
  const isEditMode = useEditModeStore(s => s.isEditMode)
  const { isHidden, toggleHidden, setBgColor, getBgColor } = useSectionManager()
  const colorRef = useRef<HTMLInputElement>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const def = HOME_SECTIONS.find(s => s.id === id)
  const hidden = isHidden(id)
  const bgColor = getBgColor(id)

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    ...(bgColor ? { backgroundColor: bgColor } : {}),
  }

  // Không edit mode + bị ẩn → không render gì
  if (!isEditMode && hidden) return null

  // Không edit mode → render bình thường (có thể có bg color)
  if (!isEditMode) {
    return (
      <div style={bgColor ? { backgroundColor: bgColor } : undefined}>
        {children}
      </div>
    )
  }

  // Edit mode
  return (
    <div ref={setNodeRef} style={style}>
      {/* Control bar */}
      <div
        className="relative z-30 flex items-center gap-2 px-4 py-2 mx-4 mt-2 rounded-xl border border-brand-gold/30 bg-gray-900/90 backdrop-blur shadow-lg"
        style={{ marginBottom: hidden ? 0 : '-0.5rem' }}
      >
        {/* Drag handle */}
        {!def?.required ? (
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-brand-gold transition-colors p-1 rounded"
            title="Kéo để sắp xếp"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
        ) : (
          <span className="w-7" /> // spacer for required sections
        )}

        {/* Label */}
        <span className="text-white text-xs font-semibold flex items-center gap-1.5 flex-1">
          <span>{def?.icon}</span>
          <span>{def?.label ?? id}</span>
          {def?.required && (
            <span className="text-[10px] text-gray-500 font-normal">(bắt buộc)</span>
          )}
        </span>

        {/* Background color */}
        <div className="flex items-center gap-1" title="Màu nền section">
          <div
            className="w-5 h-5 rounded-full border-2 border-white/30 cursor-pointer hover:scale-110 transition-transform shadow"
            style={{ background: bgColor || 'transparent', backgroundImage: bgColor ? undefined : 'linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%),linear-gradient(45deg,#555 25%,transparent 25%,transparent 75%,#555 75%)', backgroundSize: '6px 6px', backgroundPosition: '0 0,3px 3px' }}
            onClick={() => colorRef.current?.click()}
          />
          {bgColor && (
            <button
              onClick={() => setBgColor(id, '')}
              className="text-[10px] text-gray-500 hover:text-red-400 transition-colors"
              title="Xóa màu nền"
            >
              ✕
            </button>
          )}
          <button
            onClick={() => colorRef.current?.click()}
            className="text-gray-400 hover:text-purple-400 transition-colors"
            title="Chọn màu nền"
          >
            <Palette size={13} />
          </button>
          <input
            ref={colorRef}
            type="color"
            value={bgColor || '#1a1a1a'}
            onChange={e => setBgColor(id, e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
          />
        </div>

        {/* Hide / Show toggle */}
        {!def?.required && (
          <button
            onClick={() => toggleHidden(id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              hidden
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
            }`}
            title={hidden ? 'Hiện section này' : 'Ẩn section này'}
          >
            {hidden ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{hidden ? 'Hiện' : 'Ẩn'}</span>
          </button>
        )}
      </div>

      {/* Section content — dimmed if hidden */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: hidden ? 0.25 : 1, pointerEvents: hidden ? 'none' : 'auto' }}
      >
        {children}
      </div>

      {/* Hidden overlay label */}
      {hidden && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <span className="bg-gray-900/80 border border-red-500/40 text-red-400 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur">
            🚫 Section đang ẩn — chỉ admin mới thấy
          </span>
        </div>
      )}
    </div>
  )
}
