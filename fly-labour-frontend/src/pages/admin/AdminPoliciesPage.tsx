import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Save } from "lucide-react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";
import { settingsApi } from "@/services/api";

interface Policy {
  slug: string;
  title: string;
  displayInFooter: boolean;
  content: string;
  order: number;
}

const DEFAULT_POLICIES: Policy[] = [
  {
    slug: "terms-of-service",
    title: "Điều khoản sử dụng",
    displayInFooter: true,
    content: "Nội dung Điều khoản sử dụng...",
    order: 1,
  },
  {
    slug: "privacy-policy",
    title: "Chính sách bảo mật",
    displayInFooter: true,
    content: "Nội dung Chính sách bảo mật...",
    order: 2,
  },
  {
    slug: "return-policy",
    title: "Chính sách hoàn tiền",
    displayInFooter: true,
    content: "Nội dung Chính sách hoàn tiền...",
    order: 3,
  },
  {
    slug: "contact-policy",
    title: "Chính sách liên hệ",
    displayInFooter: false,
    content: "Nội dung Chính sách liên hệ...",
    order: 4,
  },
];

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(DEFAULT_POLICIES);
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

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const result = await settingsApi.getAll();
      const policiesData = result?.data?.policies
        ? JSON.parse(result.data.policies)
        : DEFAULT_POLICIES;
      setPolicies(policiesData);
    } catch {
      setPolicies(DEFAULT_POLICIES);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({
      slug: "",
      title: "",
      displayInFooter: true,
      content: "",
      order: policies.length + 1,
    });
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
      let updated: Policy[];
      if (modal === "add") {
        updated = [...policies, form];
      } else {
        updated = policies.map((p) => (p.slug === editing?.slug ? form : p));
      }
      updated.sort((a, b) => a.order - b.order);

      await settingsApi.save({ policies: JSON.stringify(updated) });
      setPolicies(updated);
      setModal(null);
      toast.success(
        modal === "add" ? "Thêm chính sách thành công" : "Cập nhật thành công",
      );
    } catch (err) {
      toast.error("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

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
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-theme-text-base">
            📋 Quản lý Điều khoản & Chính sách
          </h1>
          <p className="text-theme-text-tertiary text-sm mt-1">
            Thêm/sửa nội dung hiển thị ở footer và các trang riêng
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-gold-primary text-slate-900 rounded-lg font-semibold hover:bg-brand-gold-primary/90 transition-colors"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme-border-default bg-theme-surfaceSecondary/50">
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Tiêu đề
                </th>
                <th className="text-left px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Slug
                </th>
                <th className="text-center px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Hiển thị Footer
                </th>
                <th className="text-center px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Thứ tự
                </th>
                <th className="text-right px-4 py-3 text-xs text-theme-text-tertiary uppercase tracking-wide font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {policies.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-theme-text-tertiary"
                  >
                    Chưa có chính sách nào. Hãy thêm mới!
                  </td>
                </tr>
              ) : (
                policies.map((p) => (
                  <tr
                    key={p.slug}
                    className="border-b border-theme-border-default/40 hover:bg-theme-surfaceSecondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-theme-text-base">
                        {p.title}
                      </div>
                      <code className="text-xs text-theme-text-tertiary">
                        {p.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-theme-text-tertiary text-sm">
                      <code className="bg-theme-background px-2 py-1 rounded">
                        {p.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleVisibility(p.slug)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          p.displayInFooter
                            ? "bg-green-500/20 text-green-600 border border-green-500/30"
                            : "bg-gray-500/20 text-gray-600 border border-gray-500/30"
                        }`}
                      >
                        {p.displayInFooter ? (
                          <Eye size={12} />
                        ) : (
                          <EyeOff size={12} />
                        )}
                        {p.displayInFooter ? "Có" : "Không"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-theme-text-tertiary">
                      <input
                        type="number"
                        value={p.order}
                        onChange={(e) => {
                          const updated = policies.map((policy) =>
                            policy.slug === p.slug
                              ? {
                                  ...policy,
                                  order: parseInt(e.target.value) || 0,
                                }
                              : policy,
                          );
                          setPolicies(updated);
                        }}
                        onBlur={() => {
                          const sorted = [...policies].sort(
                            (a, b) => a.order - b.order,
                          );
                          settingsApi
                            .save({ policies: JSON.stringify(sorted) })
                            .then(() => setPolicies(sorted))
                            .catch(() => {});
                        }}
                        className="input-dark w-12 text-center text-xs py-1"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 hover:bg-amber-600/10 transition-colors"
                        >
                          <Pencil size={12} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.slug)}
                          disabled={deleting === p.slug}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-600/10 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} /> Xóa
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border-default rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-theme-border-default sticky top-0 bg-theme-surface z-10">
              <h2 className="font-semibold text-theme-text-base">
                {modal === "add"
                  ? "➕ Thêm Chính sách"
                  : "✏️ Chỉnh sửa Chính sách"}
              </h2>
              <button onClick={() => setModal(null)}>
                <X
                  size={18}
                  className="text-theme-text-tertiary hover:text-theme-text-base"
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-theme-text-secondary font-semibold uppercase tracking-wider block mb-1.5">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");
                    setForm({ ...form, title, slug: slug || "policy" });
                  }}
                  className="input-dark"
                  placeholder="Ví dụ: Điều khoản sử dụng"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs text-theme-text-secondary font-semibold uppercase tracking-wider block mb-1.5">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-dark"
                  placeholder="terms-of-service"
                />
                <p className="text-xs text-theme-text-tertiary mt-1">
                  🔗 URL sẽ là: /policy/{form.slug}
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="text-xs text-theme-text-secondary font-semibold uppercase tracking-wider block mb-1.5">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: parseInt(e.target.value) || 1 })
                  }
                  className="input-dark"
                  min={1}
                />
              </div>

              {/* Display in Footer */}
              <div className="flex items-center gap-3 p-3 bg-theme-background border border-theme-border-default rounded-xl">
                <input
                  type="checkbox"
                  checked={form.displayInFooter}
                  onChange={(e) =>
                    setForm({ ...form, displayInFooter: e.target.checked })
                  }
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <div>
                  <p className="font-medium text-theme-text-base text-sm">
                    Hiển thị ở Footer
                  </p>
                  <p className="text-xs text-theme-text-tertiary">
                    Nếu bật, link này sẽ hiển thị ở footer website
                  </p>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-xs text-theme-text-secondary font-semibold uppercase tracking-wider block mb-1.5">
                  Nội dung *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="input-dark min-h-48 resize-none"
                  placeholder="Nhập nội dung chính sách..."
                />
                <p className="text-xs text-theme-text-tertiary mt-1">
                  💡 Hỗ trợ markdown và text thuần
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-theme-border-default p-4 bg-theme-background flex items-center justify-between">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 rounded-lg border border-theme-border-default text-theme-text-base hover:bg-theme-surface transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-brand-gold-primary text-slate-900 rounded-lg font-semibold hover:bg-brand-gold-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />{" "}
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Lưu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
