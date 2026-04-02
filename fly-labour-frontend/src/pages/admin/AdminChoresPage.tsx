import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { choresApi } from '@/services/api'
import { useChoreSocket } from '@/hooks/useChoreSocket'
import type { Chore, ChoreStatus } from '@/types'

// ── helpers ──────────────────────────────────────────────────────────────────

function toYYYYMM(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
function toYYYYMMDD(d: Date) {
  return d.toISOString().split('T')[0]
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

const STATUS_CFG: Record<ChoreStatus, { label: string; icon: React.FC<any>; cls: string; dot: string }> = {
  pending:     { label: 'Chờ làm',     icon: Clock,         cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',  dot: 'bg-yellow-400' },
  in_progress: { label: 'Đang làm',    icon: AlertCircle,   cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20',        dot: 'bg-blue-400'   },
  done:        { label: 'Hoàn thành',  icon: CheckCircle,   cls: 'text-green-400 bg-green-400/10 border-green-400/20',     dot: 'bg-green-400'  },
}

const MONTH_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
const DOW_VI   = ['CN','T2','T3','T4','T5','T6','T7']

// ── types ─────────────────────────────────────────────────────────────────────

type FormData = { title: string; description: string; date: string; status: ChoreStatus; assignedToId: string }
const EMPTY_FORM: FormData = { title: '', description: '', date: '', status: 'pending', assignedToId: '' }

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminChoresPage() {
  const queryClient = useQueryClient()
  useChoreSocket() // real-time sync via WebSocket

  const today = new Date()
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modal, setModal] = useState<Chore | 'new' | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const monthKey = toYYYYMM(new Date(cursor.year, cursor.month, 1))

  // ── data ──────────────────────────────────────────────────────────────────
  const { data: chores = [], isLoading } = useQuery<Chore[]>({
    queryKey: ['chores', monthKey],
    queryFn: () => choresApi.getAll({ month: monthKey }).then(r => r.data),
  })

  // group by date for calendar cells
  const byDate: Record<string, Chore[]> = {}
  chores.forEach(c => {
    ;(byDate[c.date] ??= []).push(c)
  })

  const selectedChores = selectedDate ? (byDate[selectedDate] ?? []) : []

  // ── calendar utils ────────────────────────────────────────────────────────
  const totalDays  = daysInMonth(cursor.year, cursor.month)
  const startDay   = firstDayOfMonth(cursor.year, cursor.month) // 0=Sun

  function prevMonth() {
    setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 })
    setSelectedDate(null)
  }
  function nextMonth() {
    setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 })
    setSelectedDate(null)
  }

  // ── modal helpers ─────────────────────────────────────────────────────────
  function openNew(date?: string) {
    setForm({ ...EMPTY_FORM, date: date ?? toYYYYMMDD(today) })
    setModal('new')
  }
  function openEdit(chore: Chore) {
    setForm({ title: chore.title, description: chore.description ?? '', date: chore.date, status: chore.status, assignedToId: chore.assignedToId ?? '' })
    setModal(chore)
  }
  function closeModal() { setModal(null) }

  async function handleSave() {
    if (!form.title.trim()) { toast.error('Vui lòng nhập tiêu đề'); return }
    if (!form.date) { toast.error('Vui lòng chọn ngày'); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        date: form.date,
        status: form.status,
        assignedToId: form.assignedToId || undefined,
      }
      if (modal === 'new') {
        await choresApi.create(payload)
        toast.success('Đã tạo công việc')
      } else {
        await choresApi.update((modal as Chore).id, payload)
        toast.success('Đã cập nhật công việc')
      }
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      closeModal()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Thao tác thất bại')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await choresApi.remove(id)
      toast.success('Đã xóa công việc')
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      setDeleting(null)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xóa thất bại')
    }
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Lịch công việc</h1>
          <p className="text-brand-muted text-sm mt-0.5">{chores.length} công việc trong tháng</p>
        </div>
        <button onClick={() => openNew()} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={16} /> Thêm công việc
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-brand-card border border-brand-border rounded-2xl p-5">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/5 text-brand-muted hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-white font-semibold">
              {MONTH_VI[cursor.month]} {cursor.year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/5 text-brand-muted hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-2">
            {DOW_VI.map(d => (
              <div key={d} className="text-center text-xs font-medium text-brand-muted py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-16 bg-brand-dark rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before month start */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16" />
              ))}

              {/* Day cells */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day    = i + 1
                const dateStr = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const dayChores = byDate[dateStr] ?? []
                const isToday   = dateStr === toYYYYMMDD(today)
                const isSelected = dateStr === selectedDate

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`h-16 rounded-xl p-1.5 text-left transition-all duration-150 border ${
                      isSelected
                        ? 'bg-brand-gold/15 border-brand-gold/30'
                        : isToday
                        ? 'bg-white/5 border-brand-gold/20'
                        : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-xs font-semibold block mb-1 ${
                      isToday ? 'text-brand-gold' : isSelected ? 'text-brand-gold' : 'text-white'
                    }`}>
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayChores.slice(0, 2).map(c => (
                        <div key={c.id} className={`w-full h-1.5 rounded-full ${STATUS_CFG[c.status].dot}`} />
                      ))}
                      {dayChores.length > 2 && (
                        <p className="text-[9px] text-brand-muted">+{dayChores.length - 2}</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brand-border">
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${v.dot}`} />
                <span className="text-xs text-brand-muted">{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel — selected day or month list */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">{selectedDate}</h3>
                <button
                  onClick={() => openNew(selectedDate)}
                  className="flex items-center gap-1 text-xs text-brand-gold hover:text-yellow-300 transition-colors"
                >
                  <Plus size={13} /> Thêm
                </button>
              </div>

              {selectedChores.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-brand-muted text-sm">Không có công việc</p>
                  <button onClick={() => openNew(selectedDate)} className="mt-3 text-xs text-brand-gold hover:underline">
                    Tạo công việc mới
                  </button>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto flex-1">
                  {selectedChores.map(c => (
                    <ChoreCard key={c.id} chore={c} onEdit={openEdit} onDelete={setDeleting} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-white font-semibold text-sm mb-4">
                Tất cả công việc — {MONTH_VI[cursor.month]}
              </h3>
              {chores.length === 0 && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <p className="text-3xl mb-2">🗓️</p>
                  <p className="text-brand-muted text-sm">Chưa có công việc nào</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto flex-1">
                  {chores.map(c => (
                    <ChoreCard key={c.id} chore={c} onEdit={openEdit} onDelete={setDeleting} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <p className="text-white font-semibold mb-2">Xác nhận xóa</p>
            <p className="text-brand-muted text-sm mb-5">Bạn chắc chắn muốn xóa công việc này?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)} className="flex-1 px-4 py-2 rounded-xl border border-brand-border text-sm text-brand-muted hover:text-white hover:border-white/20 transition-colors">
                Hủy
              </button>
              <button onClick={() => handleDelete(deleting)} className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-colors">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-white font-semibold">{modal === 'new' ? 'Tạo công việc mới' : 'Chỉnh sửa công việc'}</h2>
              <button onClick={closeModal} className="text-brand-muted hover:text-white"><X size={18} /></button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Tiêu đề *</label>
                <input
                  className="input-dark"
                  placeholder="VD: Dọn phòng khách"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Mô tả</label>
                <textarea
                  className="input-dark h-20 resize-none"
                  placeholder="Chi tiết công việc..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Ngày *</label>
                  <input
                    type="date"
                    className="input-dark"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Trạng thái</label>
                  <select
                    className="input-dark"
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as ChoreStatus }))}
                  >
                    {Object.entries(STATUS_CFG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-brand-border">
              <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-xl border border-brand-border text-sm text-brand-muted hover:text-white hover:border-white/20 transition-colors">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-primary px-4 py-2 text-sm flex items-center justify-center gap-2"
              >
                {saving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
                {modal === 'new' ? 'Tạo công việc' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Chore card sub-component ──────────────────────────────────────────────────

function ChoreCard({ chore, onEdit, onDelete }: { chore: Chore; onEdit: (c: Chore) => void; onDelete: (id: string) => void }) {
  const cfg = STATUS_CFG[chore.status]
  const Icon = cfg.icon
  return (
    <div className="bg-brand-dark border border-brand-border rounded-xl p-3 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{chore.title}</p>
          {chore.description && (
            <p className="text-brand-muted text-xs mt-0.5 truncate">{chore.description}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${cfg.cls}`}>
              <Icon size={9} />
              {cfg.label}
            </span>
            <span className="text-[10px] text-brand-muted">{chore.date}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(chore)} className="p-1.5 rounded-lg hover:bg-white/10 text-brand-muted hover:text-white transition-colors">
            <Pencil size={12} />
          </button>
          <button onClick={() => onDelete(chore.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-brand-muted hover:text-red-400 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
