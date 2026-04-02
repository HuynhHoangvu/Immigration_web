import { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
  User,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { contactApi } from "@/services/api";
import { formatDate } from "@/utils/helpers";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const load = () => {
    setLoading(true);
    contactApi
      .getAll()
      .then((r) => setContacts(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await contactApi.markRead(id);
      setContacts((cs) =>
        cs.map((c) => (c.id === id ? { ...c, isRead: true } : c)),
      );
      if (selected?.id === id)
        setSelected((s) => (s ? { ...s, isRead: true } : s));
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactApi.remove(id);
      toast.success("Đã xóa liên hệ");
      setContacts((cs) => cs.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleting(null);
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const openDetail = (c: Contact) => {
    setSelected(c);
    if (!c.isRead) handleMarkRead(c.id);
  };

  const filtered = contacts.filter((c) => {
    if (filter === "unread") return !c.isRead;
    if (filter === "read") return c.isRead;
    return true;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý liên hệ</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {contacts.length} liên hệ
            {unreadCount > 0 && (
              <span className="ml-2 text-brand-gold font-medium">
                · {unreadCount} chưa đọc
              </span>
            )}
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-brand-card border border-brand-border rounded-xl p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-brand-gold text-white"
                  : "text-brand-muted hover:text-white"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Đã đọc"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-brand-card rounded-2xl animate-pulse"
              />
            ))
          ) : filtered.length === 0 ? (
            <div className="bg-brand-card border border-brand-border rounded-2xl p-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-brand-muted text-sm">Không có liên hệ nào</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => openDetail(c)}
                className={`bg-brand-card border rounded-2xl p-4 cursor-pointer transition-all hover:border-brand-gold/30 ${
                  selected?.id === c.id
                    ? "border-brand-gold/40 bg-brand-gold/5"
                    : c.isRead
                      ? "border-brand-border"
                      : "border-brand-gold/20 bg-brand-gold/[0.03]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm shrink-0"
                      style={{
                        background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                      }}
                    >
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-medium truncate">
                          {c.name}
                        </p>
                        {!c.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                        )}
                      </div>
                      <p className="text-brand-muted text-xs truncate">
                        {c.email}
                      </p>
                      <p className="text-brand-muted text-xs mt-1 line-clamp-1">
                        {c.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-brand-muted text-[10px]">
                      {formatDate(c.createdAt)}
                    </p>
                    {c.isRead ? (
                      <CheckCircle
                        size={12}
                        className="text-green-400 ml-auto mt-1"
                      />
                    ) : (
                      <Mail
                        size={12}
                        className="text-brand-gold ml-auto mt-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
              <Mail size={32} className="text-brand-muted mb-3" />
              <p className="text-brand-muted text-sm">
                Chọn một liên hệ để xem chi tiết
              </p>
            </div>
          ) : (
            <>
              {/* Detail header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <Eye size={15} className="text-brand-gold" />
                  <span className="text-white font-semibold text-sm">
                    Chi tiết liên hệ
                  </span>
                  {selected.isRead && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">
                      Đã đọc
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-brand-muted hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Detail body */}
              <div className="p-5 space-y-4">
                {/* Sender info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-brand-dark rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <User size={11} className="text-brand-muted" />
                      <span className="text-[10px] text-brand-muted">
                        Họ tên
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium">
                      {selected.name}
                    </p>
                  </div>
                  <div className="bg-brand-dark rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Mail size={11} className="text-brand-muted" />
                      <span className="text-[10px] text-brand-muted">
                        Email
                      </span>
                    </div>
                    <p className="text-white text-sm truncate">
                      {selected.email}
                    </p>
                  </div>
                  {selected.phone && (
                    <div className="bg-brand-dark rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Phone size={11} className="text-brand-muted" />
                        <span className="text-[10px] text-brand-muted">
                          Điện thoại
                        </span>
                      </div>
                      <p className="text-white text-sm">{selected.phone}</p>
                    </div>
                  )}
                  <div className="bg-brand-dark rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock size={11} className="text-brand-muted" />
                      <span className="text-[10px] text-brand-muted">
                        Thời gian
                      </span>
                    </div>
                    <p className="text-white text-sm">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-brand-dark rounded-xl p-4">
                  <p className="text-[10px] text-brand-muted mb-2">Nội dung</p>
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 py-2.5 text-sm"
                  >
                    <Mail size={14} /> Trả lời email
                  </a>
                  <button
                    onClick={() => setDeleting(selected.id)}
                    className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <p className="text-white font-semibold mb-2">Xác nhận xóa</p>
            <p className="text-brand-muted text-sm mb-5">
              Bạn chắc chắn muốn xóa liên hệ này?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-brand-border text-sm text-brand-muted hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
