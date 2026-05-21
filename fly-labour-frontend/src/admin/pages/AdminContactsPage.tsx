import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  X,
  Phone,
  User,
  Clock,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";
import { contactApi } from "@core/services/api";
import { formatDate } from "@core/utils/helpers";
import clsx from "clsx";
import s from "./AdminContactsPage.module.scss";

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
      setContacts((cs) => cs.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
      if (selected?.id === id) setSelected((old) => (old ? { ...old, isRead: true } : old));
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
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>
            <Inbox className={s.titleIcon} />
            Quản lý liên hệ
          </h1>
          <p className={s.sub}>
            Tổng {contacts.length} liên hệ khách hàng
            {unreadCount > 0 && <span className={s.subAccent}>· {unreadCount} chưa phản hồi</span>}
          </p>
        </div>
        <div className={s.filterWrap}>
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(s.filterBtn, filter === f && s.filterBtnActive)}
            >
              {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Đã đọc"}
            </button>
          ))}
        </div>
      </div>

      <div className={s.contentGrid}>
        <div className={clsx(s.listCol, "custom-scrollbar")}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className={s.skeleton} />)
          ) : filtered.length === 0 ? (
            <div className={clsx(s.card, s.empty)}>
              <p className={s.emptyEmoji}>📭</p>
              <p className={s.emptyText}>Không tìm thấy liên hệ nào trong hộp thư</p>
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => openDetail(c)}
                className={clsx(
                  s.contactItem,
                  selected?.id === c.id
                    ? s.contactSelected
                    : c.isRead
                      ? s.contactRead
                      : s.contactUnread,
                )}
              >
                <div className={s.rowTop}>
                  <div className={s.rowMain}>
                    <div className={s.avatar}>{c.name.charAt(0).toUpperCase()}</div>
                    <div className={s.mainText}>
                      <div className={s.nameRow}>
                        <p className={s.name}>{c.name}</p>
                        {!c.isRead && <span className={s.dot} />}
                      </div>
                      <p className={s.email}>{c.email}</p>
                      <p className={s.snippet}>"{c.message}"</p>
                    </div>
                  </div>
                  <div className={s.aside}>
                    <p className={s.dateSm}>{formatDate(c.createdAt)}</p>
                    <div className={s.statusIcon}>
                      {c.isRead ? (
                        <CheckCircle size={14} className={s.statusRead} />
                      ) : (
                        <Mail size={14} className={s.statusUnread} />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className={clsx(s.card, s.detail)}>
          {!selected ? (
            <div className={s.detailEmpty}>
              <div className={s.detailIconWrap}>
                <Mail size={32} className={s.detailIcon} />
              </div>
              <p className={s.detailEmptyText}>
                Chọn một liên hệ từ danh sách bên trái
                <br />
                để xem nội dung tin nhắn chi tiết
              </p>
            </div>
          ) : (
            <>
              <div className={s.detailHead}>
                <div className={s.detailHeadLeft}>
                  <div className={s.detailHeadIcon}>
                    <Eye size={18} />
                  </div>
                  <div>
                    <span className={s.detailHeadTitle}>Nội dung liên hệ</span>
                    {selected.isRead && <span className={s.readBadge}>Đã đọc</span>}
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className={s.closeBtn}>
                  <X size={20} />
                </button>
              </div>

              <div className={clsx(s.detailBody, "custom-scrollbar")}>
                <div className={s.infoGrid}>
                  <div className={s.infoCard}>
                    <div className={s.infoLabel}>
                      <User size={12} /> Họ và tên
                    </div>
                    <p className={s.infoValue}>{selected.name}</p>
                  </div>
                  <div className={s.infoCard}>
                    <div className={s.infoLabel}>
                      <Mail size={12} /> Hộp thư Email
                    </div>
                    <p className={s.infoValue}>{selected.email}</p>
                  </div>
                  {selected.phone && (
                    <div className={s.infoCard}>
                      <div className={s.infoLabel}>
                        <Phone size={12} /> Số điện thoại
                      </div>
                      <p className={s.infoValue}>{selected.phone}</p>
                    </div>
                  )}
                  <div className={s.infoCard}>
                    <div className={s.infoLabel}>
                      <Clock size={12} /> Ngày gửi
                    </div>
                    <p className={s.infoValue}>{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                <div className={s.messageCard}>
                  <p className={s.messageTitle}>Nội dung tin nhắn:</p>
                  <p className={s.messageBody}>{selected.message}</p>
                </div>

                <div className={s.actions}>
                  <a href={`mailto:${selected.email}`} className={s.replyBtn}>
                    <Mail size={18} /> Phản hồi Email ngay
                  </a>
                  <button onClick={() => setDeleting(selected.id)} className={s.deleteBtn}>
                    <Trash2 size={18} /> Xóa bỏ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn liên hệ khỏi hệ thống. Bạn chắc chắn chứ?"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
