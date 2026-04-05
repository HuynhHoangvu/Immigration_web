import { useState, useEffect } from 'react'
import { MessageCircle, X, Phone, Facebook } from 'lucide-react'
import { settingsApi } from '@/services/api'

export default function FloatingContact() {
  const [open, setOpen] = useState(false)
  const [hotline, setHotline] = useState("0333 318 882");
  const [zaloNumber, setZaloNumber] = useState("0333318882");
  const [messengerUrl, setMessengerUrl] = useState('https://m.me/flylabour')

  useEffect(() => {
    settingsApi.getAll()
      .then(r => {
        const s = r.data as Record<string, string>
        if (s.hotline)      setHotline(s.hotline)
        if (s.zaloNumber)   setZaloNumber(s.zaloNumber)
        if (s.messengerUrl) setMessengerUrl(s.messengerUrl)
      })
      .catch(() => {})
  }, [])

  const contacts = [
    {
      icon: <Phone size={18} />,
      label: 'Hotline',
      value: hotline,
      href: `tel:${hotline.replace(/\s/g, '')}`,
      bg: 'bg-green-500',
      ring: 'hover:ring-green-500/40',
    },
    {
      icon: <span className="text-sm font-black">Z</span>,
      label: 'Zalo',
      value: 'Chat Zalo',
      href: `https://zalo.me/${zaloNumber.replace(/\s/g, '')}`,
      bg: 'bg-[#0068FF]',
      ring: 'hover:ring-[#0068FF]/40',
    },
    {
      icon: <Facebook size={18} />,
      label: 'Messenger',
      value: 'Nhắn tin Facebook',
      href: messengerUrl,
      bg: 'bg-[#0099FF]',
      ring: 'hover:ring-[#0099FF]/40',
    },
  ]

  return (
    <div className="fixed right-5 bottom-8 z-50 flex flex-col items-end gap-3">
      {/* Contact items */}
      {open && (
        <div className="flex flex-col gap-2">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-3 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-2xl px-4 py-2.5 shadow-xl hover:border-gray-400 dark:hover:border-white/20 ring-2 ring-transparent ${c.ring} transition-all duration-200`}
            >
              <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                {c.icon}
              </div>
              <div>
                <p className="text-xs text-brand-muted leading-none">{c.label}</p>
                <p className="text-sm text-black dark:text-white font-semibold">{c.value}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Toggle button + pulse ring */}
      <div className="relative">
        {!open && (
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl animate-ping opacity-25"
            style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}
          />
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #e4a808, #fdd52f)' }}
        >
          {open
            ? <X size={22} className="text-slate-900" />
            : <MessageCircle size={22} className="text-slate-900" />
          }
        </button>
      </div>
    </div>
  )
}
