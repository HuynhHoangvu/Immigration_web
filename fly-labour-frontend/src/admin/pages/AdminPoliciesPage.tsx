import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Save,
  FileText,
  ListOrdered,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { settingsApi } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminPoliciesPage.module.scss";

interface Policy {
  slug: string;
  title: string;
  displayInFooter: boolean;
  content: string;
  order: number;
}

const DEFAULT_POLICIES: Policy[] = [
  { slug: "terms-of-service", title: "Điều khoản sử dụng", displayInFooter: true, content: "Nội dung Điều khoản sử dụng...", order: 1 },
  { slug: "privacy-policy", title: "Chính sách bảo mật", displayInFooter: true, content: "Nội dung Chính sách bảo mật...", order: 2 },
  { slug: "return-policy", title: "Chính sách hoàn tiền", displayInFooter: true, content: "Nội dung Chính sách hoàn tiền...", order: 3 },
  { slug: "contact-policy", title: "Chính sách liên hệ", displayInFooter: false, content: "Nội dung Chính sách liên hệ...", order: 4 },
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Policy | null>(null);
  const [form, setForm] = useState<Policy>({
    slug: "",
    title: "",
    displayInFooter: true,
    content: "",
    order: 1,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState<string | null>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const result = await settingsApi.getAll();
      const policiesData = result?.data?.policies ? JSON.parse(result.data.policies) : DEFAULT_POLICIES;
      setPolicies(policiesData);
    } catch {
      setPolicies(DEFAULT_POLICIES);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ slug: "", title: "", displayInFooter: true, content: "", order: policies.length + 1 });
    setEditing(null);
    setModal("add");
  };

  const openEditModal = (policy: Policy) => {
    setForm(policy);
    setEditing(policy);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.title.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      let updated: Policy[] = [];
      if (modal === "add") updated = [...policies, form];
      else updated = policies.map((p) => (p.slug === editing?.slug ? form : p));
      updated.sort((a, b) => a.order - b.order);
      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      setModal(null);
      toast.success(modal === "add" ? "Thêm chính sách thành công" : "Cập nhật thành công");
    } catch {
      toast.error("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    setDeleting(slug);
    try {
      const updated = policies.filter((p) => p.slug !== slug);
      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      toast.success("Xóa thành công");
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setDeleting(null);
      setConfirmDeleteSlug(null);
    }
  };

  const handleToggleVisibility = async (slug: string) => {
    try {
      const updated = policies.map((p) =>
        p.slug === slug ? { ...p, displayInFooter: !p.displayInFooter } : p,
      );
      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      toast.success("Cập nhật thành công");
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <div className={s.loadingWrap}>
        <Loader2 size={32} className={clsx(s.loadingIcon, s.spin)} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.headTitle}>
            <FileText className={s.iconAmber} />
            Quản lý Điều khoản & Chính sách
          </h1>
          <p className={s.sub}>Chỉnh sửa nội dung pháp lý hiển thị tại Footer và các trang tĩnh</p>
        </div>
        <button onClick={openAddModal} className={clsx("btn-primary", s.addBtn)}>
          <Plus size={18} /> Thêm mới chính sách
        </button>
      </div>

      <div className={clsx(s.card, "overflow-hidden")}>
        <div className={clsx(s.tableWrap, "custom-scrollbar")}>
          <table className={s.table}>
            <thead>
              <tr className={clsx(s.theadRow, "fl-surface-muted-50")}>
                <th className={s.th}>Tiêu đề chính sách</th>
                <th className={s.th}>Đường dẫn (Slug)</th>
                <th className={clsx(s.th, s.thCenter)}>Hiển thị Footer</th>
                <th className={clsx(s.th, s.thCenter)}>Thứ tự</th>
                <th className={clsx(s.th, s.thRight)}>Thao tác</th>
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={5} className={s.emptyCell}>Chưa có dữ liệu chính sách nào được ghi nhận.</td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr key={p.slug} className={s.row}>
                    <td className={s.td}><div className={s.titleCell}>{p.title}</div></td>
                    <td className={s.td}><code className={s.slugCode}>/policy/{p.slug}</code></td>
                    <td className={clsx(s.td, s.tdCenter)}>
                      <button
                        onClick={() => handleToggleVisibility(p.slug)}
                        className={clsx(s.visBtn, p.displayInFooter ? s.visOn : s.visOff)}
                      >
                        {p.displayInFooter ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.displayInFooter ? "Hiển thị" : "Ẩn"}
                      </button>
                    </td>
                    <td className={clsx(s.td, s.tdCenter)}>
                      <div className={s.orderChip}>
                        <ListOrdered size={12} className={s.orderIcon} />
                        {p.order}
                      </div>
                    </td>
                    <td className={clsx(s.td, s.tdRight)}>
                      <div className={s.actions}>
                        <button onClick={() => openEditModal(p)} className={clsx(s.iconBtn, s.editBtn)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteSlug(p.slug)}
                          disabled={deleting === p.slug}
                          className={clsx(s.iconBtn, s.deleteBtn)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className={clsx(s.modalOverlay, "animate-in fade-in duration-200")}>
          <div className={s.modalCard}>
            <div className={s.modalHead}>
              <h2 className={s.modalTitle}>
                <FileText className={s.iconAmber} />
                {modal === "add" ? "Thêm chính sách mới" : "Chỉnh sửa chính sách"}
              </h2>
              <button onClick={() => setModal(null)} className={s.closeBtn}><X size={20} /></button>
            </div>

            <div className={clsx(s.modalBody, "custom-scrollbar")}>
              <div className={s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>Tiêu đề chính sách *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      setForm({ ...form, title, slug: slug || "policy" });
                    }}
                    className={s.input}
                    placeholder="VD: Điều khoản sử dụng"
                  />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Slug (URL) *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={clsx(s.input, s.mono)}
                    placeholder="terms-of-service"
                  />
                </div>
              </div>

              <div className={s.grid2}>
                <div className={s.field}>
                  <label className={s.label}>Thứ tự hiển thị</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 1 })}
                    className={s.input}
                    min={1}
                  />
                </div>
                <div className={s.toggleRow}>
                  <label className={s.toggleLabel}>
                    <div className={clsx(s.toggleTrack, form.displayInFooter ? s.toggleOn : s.toggleOff)}>
                      <div className={clsx(s.toggleThumb, form.displayInFooter ? s.thumbOn : s.thumbOff)} />
                    </div>
                    <input
                      type="checkbox"
                      checked={form.displayInFooter}
                      onChange={(e) => setForm({ ...form, displayInFooter: e.target.checked })}
                      className={s.hidden}
                    />
                    <span className={s.toggleText}>Hiện ở Footer</span>
                  </label>
                </div>
              </div>

              <div className={s.field}>
                <label className={s.label}>Nội dung chi tiết *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className={s.textarea}
                  placeholder="Nhập nội dung quy định, chính sách..."
                />
                <p className={s.tinyHelp}>Hệ thống hỗ trợ định dạng văn bản Markdown.</p>
              </div>
            </div>

            <div className={clsx(s.foot, "fl-surface-muted-50")}>
              <button onClick={() => setModal(null)} className={s.cancelBtn}>Hủy bỏ</button>
              <button onClick={handleSave} disabled={saving} className={clsx("btn-primary", s.saveBtn)}>
                {saving ? <Loader2 size={18} className={s.spin} /> : <Save size={18} />}
                {modal === "add" ? "Thêm chính sách" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteSlug && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn chính sách khỏi hệ thống. Các liên kết footer liên quan cũng sẽ bị gỡ bỏ."
          onConfirm={() => handleDelete(confirmDeleteSlug)}
          onCancel={() => setConfirmDeleteSlug(null)}
        />
      )}
    </div>
  );
}
