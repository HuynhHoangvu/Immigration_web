import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Phone, Facebook, Link2, Check } from "lucide-react";
import { useContentStore } from "@core/hooks/usePageContent";
import { useEditModeStore } from "@core/store/editModeStore";
import clsx from "clsx";
import s from "./FloatingContact.module.scss";

type ContactKind = "hotline" | "zalo" | "messenger";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditMode = useEditModeStore((st) => st.isEditMode);
  const setChange = useEditModeStore((st) => st.setChange);
  const storedContent = useContentStore((st) => st.content);
  const setStored = useContentStore((st) => st.set);

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

  const contacts: {
    kind: ContactKind;
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
    settingKey: string;
  }[] = [
    {
      kind: "hotline",
      icon: <Phone size={18} />,
      label: "Hotline",
      value: hotline,
      href: `tel:${hotline.replace(/\s/g, "")}`,
      settingKey: "contact.hotline",
    },
    {
      kind: "zalo",
      icon: <span className={s.zaloLetter}>Z</span>,
      label: "Zalo",
      value: "Chat Zalo",
      href: `https://zalo.me/${zaloNumber.replace(/\s/g, "")}`,
      settingKey: "contact.zaloNumber",
    },
    {
      kind: "messenger",
      icon: <Facebook size={18} />,
      label: "Messenger",
      value: "Nhắn tin Facebook",
      href: messengerUrl,
      settingKey: "contact.messengerUrl",
    },
  ];

  const cardKindClass = (k: ContactKind) =>
    k === "hotline" ? s.cardHotline : k === "zalo" ? s.cardZalo : s.cardMessenger;

  const iconKindClass = (k: ContactKind) =>
    clsx(
      s.iconBase,
      k === "hotline" && s.iconHotline,
      k === "zalo" && s.iconZalo,
      k === "messenger" && s.iconMessenger,
    );

  return (
    <div className={s.wrap}>
      {isEditMode && editingKey && (
        <div className={s.editOverlay}>
          <div className={s.editDialog}>
            <p className={s.editTitle}>
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
              className={s.editInput}
            />
            <div className={s.editActions}>
              <button
                type="button"
                onClick={handleEditSave}
                className={s.btnSave}
              >
                <Check size={14} /> Lưu
              </button>
              <button
                type="button"
                onClick={() => setEditingKey(null)}
                className={s.btnCancel}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className={s.list}>
          {contacts.map((c) => (
            <div key={c.label} className={s.itemWrap}>
              <a
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className={clsx(s.card, cardKindClass(c.kind))}
                onClick={editingKey ? (e) => e.preventDefault() : undefined}
              >
                <div className={iconKindClass(c.kind)}>{c.icon}</div>
                <div>
                  <p className={s.label}>{c.label}</p>
                  <p className={s.value}>{c.value}</p>
                </div>
              </a>

              {isEditMode && (
                <button
                  type="button"
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
                  className={s.editFab}
                  title={`Chỉnh sửa ${c.label}`}
                >
                  <Link2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={s.toggleWrap}>
        {!open && (
          <span
            className={s.pulse}
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          />
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={s.toggleBtn}
          style={{ background: "linear-gradient(135deg, #e4a808, #fdd52f)" }}
        >
          {open ? (
            <X size={22} className={s.toggleIcon} />
          ) : (
            <MessageCircle size={22} className={s.toggleIcon} />
          )}
        </button>
      </div>
    </div>
  );
}
