import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Phone, Facebook, Link2, Check } from "lucide-react";
import { useContentStore } from "@/core/hooks/usePageContent";
import { useEditModeStore } from "@/core/store/editModeStore";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const setChange = useEditModeStore((s) => s.setChange);
  const storedContent = useContentStore((s) => s.content);
  const setStored = useContentStore((s) => s.set);

  const hotline = storedContent["contact.hotline"] ?? "0866-879-755";
  const zaloNumber = storedContent["contact.zaloNumber"] ?? "0866879755";
  const messengerUrl =
    storedContent["contact.messengerUrl"] ?? "https://m.me/flylabour";

  useEffect(() => {
    if (editingKey) inputRef.current?.focus();
  }, [editingKey]);

  const handleEditStart = (key: string, value: string) => {
    setEditingKey(key);
    setEditDraft(value);
  };

  const handleEditSave = () => {
    const trimmed = editDraft.trim();
    if (trimmed) {
      setStored(editingKey!, trimmed);
      setChange(`content.${editingKey}`, trimmed);
    }
    setEditingKey(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEditSave();
    }
    if (e.key === "Escape") setEditingKey(null);
  };

  const contacts = [
    {
      icon: <Phone size={18} />,
      label: "Hotline",
      value: hotline,
      href: `tel:${hotline.replace(/\s/g, "")}`,
      bg: "bg-green-500",
      ring: "hover:ring-green-500/40",
      settingKey: "contact.hotline",
    },
    {
      icon: <span className="text-sm font-black">Z</span>,
      label: "Zalo",
      value: "Chat Zalo",
      href: `https://zalo.me/${zaloNumber.replace(/\s/g, "")}`,
      bg: "bg-[#0068FF]",
      ring: "hover:ring-[#0068FF]/40",
      settingKey: "contact.zaloNumber",
    },
    {
      icon: <Facebook size={18} />,
      label: "Messenger",
      value: "Nhắn tin Facebook",
      href: messengerUrl,
      bg: "bg-[#0099FF]",
      ring: "hover:ring-[#0099FF]/40",
      settingKey: "contact.messengerUrl",
    },
  ];

  return (
    <div className="fixed right-5 bottom-8 z-50 flex flex-col items-end gap-3">
      {/* Edit form — overlay when editing */}
      {isEditMode && editingKey && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-xl max-w-xs">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Chỉnh sửa{" "}
              {editingKey === "contact.hotline"
                ? "Hotline"
                : editingKey === "contact.zaloNumber"
                  ? "Zalo"
                  : "Messenger"}
            </p>
            <input
              ref={inputRef}
              type={editingKey === "contact.messengerUrl" ? "url" : "text"}
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                editingKey === "contact.messengerUrl"
                  ? "https://m.me/..."
                  : "0333..."
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold flex items-center justify-center gap-1"
              >
                <Check size={14} /> Lưu
              </button>
              <button
                onClick={() => setEditingKey(null)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact items */}
      {open && (
        <div className="flex flex-col gap-2">
          {contacts.map((c) => (
            <div key={c.label} className="relative group">
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-3 bg-white dark:bg-brand-card border border-gray-200 dark:border-brand-border rounded-2xl px-4 py-2.5 shadow-xl hover:border-gray-400 dark:hover:border-white/20 ring-2 ring-transparent ${c.ring} transition-all duration-200`}
                onClick={editingKey ? (e) => e.preventDefault() : undefined}
              >
                <div
                  className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}
                >
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-brand-muted leading-none">
                    {c.label}
                  </p>
                  <p className="text-sm text-black dark:text-white font-semibold">
                    {c.value}
                  </p>
                </div>
              </a>

              {/* Edit button in edit mode */}
              {isEditMode && (
                <button
                  onClick={() =>
                    handleEditStart(
                      c.settingKey,
                      c.settingKey === "contact.zaloNumber"
                        ? zaloNumber
                        : c.settingKey === "contact.hotline"
                          ? hotline
                          : messengerUrl,
                    )
                  }
                  className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gold hover:bg-yellow-500 rounded-full flex items-center justify-center text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title={`Chỉnh sửa ${c.label}`}
                >
                  <Link2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle button + pulse ring */}
      <div className="relative">
        {!open && (
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl animate-ping opacity-25"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          />
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #e4a808, #fdd52f)" }}
        >
          {open ? (
            <X size={22} className="text-slate-900" />
          ) : (
            <MessageCircle size={22} className="text-slate-900" />
          )}
        </button>
      </div>
    </div>
  );
}
