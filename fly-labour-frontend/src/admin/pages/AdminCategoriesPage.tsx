import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import { Plus, Pencil, Trash2, X, CheckCircle, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import type { Category } from "@/core/types";
import { categoriesApi, getImageUrl } from "@/core/services/api";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  isActive: boolean;
  sortOrder: string;
};

const EMPTY: FormData = {
  name: "",
  nameEn: "",
  icon: "🏷️",
  description: "",
  isActive: true,
  sortOrder: "0",
};

const ICON_OPTIONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
 
];

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const loadCats = () => {
    setLoading(true);
    categoriesApi
      .getAllAdmin()
      .then((r) => setCats(r.data))
      .catch(() => toast.error("Không tải được danh mục"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCats();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setFile(null);
    setPreview(null);
    setModal("add");
  };

  const openEdit = (c: Category) => {
    setForm({
      name: c.name,
      nameEn: c.nameEn || "",
      icon: c.icon || "🏷️",
      description: c.description || "",
      isActive: c.isActive,
      sortOrder: String(c.sortOrder),
    });
    setEditing(c);
    setFile(null);
    setPreview(c.icon?.startsWith("http") || c.icon?.startsWith("/") ? getImageUrl(c.icon) : null);
    setModal("edit");
  };

  const setField =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.nameEn) fd.append("nameEn", form.nameEn);
      fd.append("icon", form.icon);
      if (form.description) fd.append("description", form.description);
      fd.append("isActive", String(form.isActive));
      fd.append("sortOrder", form.sortOrder);
      if (file) fd.append("image", file);

      if (modal === "edit" && editing) {
        await categoriesApi.update(editing.id, fd);
        toast.success("Đã cập nhật danh mục");
      } else {
        await categoriesApi.create(fd);
        toast.success("Đã thêm danh mục");
      }
      setModal(null);
      loadCats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu danh mục");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.remove(id);
      toast.success("Đã xóa danh mục");
      setDeleting(null);
      loadCats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await categoriesApi.update(cat.id, { isActive: !cat.isActive });
      loadCats();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // Helper classes
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-all duration-300";
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Quản lý Danh mục
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm font-medium">
            {cats.length} danh mục ngành nghề đang hoạt động
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Thêm danh mục mới
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-brand-muted">
          <Loader2 size={32} className="animate-spin mb-4 text-amber-500" />
          <p className="font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cats.map((cat) => (
            <div
              key={cat.id}
              className={`${cardClasses} p-5 relative group ${!cat.isActive ? "opacity-60 grayscale-[0.5]" : "hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5"}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-brand-gold/5 border border-amber-100 dark:border-brand-gold/10 flex items-center justify-center text-2xl shadow-sm transition-colors overflow-hidden">
                  {cat.icon?.startsWith("http") ||
                  cat.icon?.startsWith("/") ||
                  cat.icon?.match(/^\d+$/) ? (
                    <img
                      src={
                        cat.icon?.match(/^\d+$/)
                          ? `/${cat.icon}.png`
                          : getImageUrl(cat.icon)
                      }
                      alt=""
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    cat.icon
                  )}
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-colors shadow-sm"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleting(cat.id)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-500/5 text-red-400 hover:text-red-600 transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-0.5">
                {cat.name}
              </h3>
              {cat.nameEn && (
                <p className="text-slate-400 dark:text-brand-muted text-xs font-semibold uppercase tracking-tight">
                  {cat.nameEn}
                </p>
              )}
              {cat.description && (
                <p className="text-slate-600 dark:text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50 dark:border-white/5">
                {cat._count && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[11px] text-slate-500 dark:text-brand-muted font-bold uppercase tracking-wider">
                      {cat._count.jobs} việc làm
                    </span>
                  </div>
                )}
                <button
                  onClick={() => toggleActive(cat)}
                  className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest transition-all ${
                    cat.isActive
                      ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                      : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.isActive ? "Hiển thị" : "Đang ẩn"}
                </button>
              </div>
            </div>
          ))}

          {cats.length === 0 && (
            <div className={`${cardClasses} col-span-full py-20 text-center`}>
              <p className="text-slate-400 dark:text-brand-muted font-medium">
                Chưa có danh mục nào được tạo.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                {modal === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Icon Selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-3 block">
                  Biểu tượng (Icon)
                </label>
                <div className="flex items-center gap-2 mb-3">
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => {
                        setForm((f) => ({ ...f, icon: ic }));
                        setFile(null);
                        setPreview(null);
                      }}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition-all overflow-hidden ${form.icon === ic && !file ? "bg-amber-100 border-amber-400 scale-110 shadow-sm" : "bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-amber-200"}`}
                    >
                      <img
                        src={`/${ic}.png`}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    id="cat-image"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFile(f);
                        setPreview(URL.createObjectURL(f));
                        setForm((prev) => ({ ...prev, icon: "" }));
                      }
                    }}
                  />
                  <label
                    htmlFor="cat-image"
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                      file || (editing && (form.icon.startsWith("http") || form.icon.startsWith("/")))
                        ? "border-amber-400 bg-amber-50/30 dark:bg-amber-500/5"
                        : "border-slate-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-brand-gold"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-brand-dark border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden shadow-sm">
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon
                          size={24}
                          className="text-slate-300 dark:text-brand-muted"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-white mb-0.5">
                        {file ? "Đã chọn ảnh mới" : (preview ? "Ảnh hiện tại" : "Tải ảnh icon mới")}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-brand-muted font-medium">
                        Dung lượng tối đa 50MB
                      </p>
                    </div>
                    <Upload
                      size={18}
                      className="text-slate-400 group-hover:text-amber-500 transition-colors"
                    />
                  </label>
                  {(file || preview) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setPreview(null);
                        setForm((f) => ({ ...f, icon: "🏷️" }));
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest block">
                    Tên tiếng Việt *
                  </label>
                  <input
                    value={form.name}
                    onChange={setField("name")}
                    className={`${inputClasses} h-11`}
                    placeholder="VD: Nông nghiệp"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest block">
                    Tên tiếng Anh
                  </label>
                  <input
                    value={form.nameEn}
                    onChange={setField("nameEn")}
                    className={`${inputClasses} h-11`}
                    placeholder="VD: Agriculture"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest block">
                  Mô tả ngắn
                </label>
                <textarea
                  value={form.description}
                  onChange={setField("description")}
                  className={`${inputClasses} py-3 h-24 resize-none`}
                  placeholder="Giới thiệu về ngành nghề này..."
                />
              </div>

              {/* Order & Active */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest block">
                    Thứ tự ưu tiên
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={setField("sortOrder")}
                    className={`${inputClasses} h-11`}
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-5 group">
                  <div
                    className={`w-10 h-5 rounded-full relative transition-colors ${form.isActive ? "bg-amber-500" : "bg-slate-200 dark:bg-white/10"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.isActive ? "left-6" : "left-1"}`}
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                    className="hidden"
                  />
                  <span className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                    Hiển thị
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
              <button
                onClick={() => setModal(null)}
                className="flex-1 h-11 rounded-xl font-bold text-slate-600 dark:text-white border border-slate-200 dark:border-brand-border hover:bg-white dark:hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 flex items-center justify-center gap-2 h-11 font-bold shadow-lg shadow-amber-500/20 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {modal === "add" ? "Thêm ngay" : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Danh mục sẽ bị xóa vĩnh viễn khỏi hệ thống."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
