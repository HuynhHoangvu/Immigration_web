import { useState, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import { Plus, Pencil, Trash2, X, CheckCircle, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import type { Category } from "@core/types";
import { categoriesApi, getImageUrl } from "@core/services/api";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./AdminCategoriesPage.module.scss";

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

const ICON_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

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
    setPreview(c.icon && (c.icon.startsWith("http") || c.icon.startsWith("/") || c.icon.includes(".")) ? getImageUrl(c.icon) : null);
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

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Quản lý Danh mục</h1>
          <p className={s.sub}>{cats.length} danh mục ngành nghề đang hoạt động</p>
        </div>
        <button onClick={openAdd} className={clsx("btn-primary", s.addBtn)}>
          <Plus size={18} /> Thêm danh mục mới
        </button>
      </div>

      {loading ? (
        <div className={s.loading}>
          <Loader2 size={32} className={clsx(s.loadingIcon, s.spin)} />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className={s.grid}>
          {cats.map((cat) => (
            <div key={cat.id} className={clsx(s.card, cat.isActive ? s.cardActive : s.cardInactive)}>
              <div className={s.cardHead}>
                <div className={s.iconWrap}>
                  {cat.icon && (cat.icon.startsWith("http") || cat.icon.startsWith("/") || cat.icon.match(/^\d+$/) || cat.icon.includes(".")) ? (
                    <img
                      src={cat.icon.match(/^\d+$/) ? `/${cat.icon}.png` : getImageUrl(cat.icon)}
                      alt={cat.name}
                      className={s.iconImg}
                    />
                  ) : (
                    cat.icon || "🏷️"
                  )}
                </div>
                <div className={s.hoverActions}>
                  <button onClick={() => openEdit(cat)} className={clsx(s.iconBtn, s.editBtn)}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleting(cat.id)} className={clsx(s.iconBtn, s.delBtn)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className={s.name}>{cat.name}</h3>
              {cat.nameEn && <p className={s.nameEn}>{cat.nameEn}</p>}
              {cat.description && <p className={s.desc}>{cat.description}</p>}

              <div className={s.foot}>
                {cat._count && (
                  <div className={s.jobs}>
                    <div className={s.dot} />
                    <span className={s.jobsText}>{cat._count.jobs} việc làm</span>
                  </div>
                )}
                <button
                  onClick={() => toggleActive(cat)}
                  className={clsx(s.statusBtn, cat.isActive ? s.statusOn : s.statusOff)}
                >
                  {cat.isActive ? "Hiển thị" : "Đang ẩn"}
                </button>
              </div>
            </div>
          ))}

          {cats.length === 0 && <div className={s.empty}>Chưa có danh mục nào được tạo.</div>}
        </div>
      )}

      {modal && (
        <div className={s.modalOverlay}>
          <div className={clsx(s.modalCard, "animate-in zoom-in-95 duration-200")}>
            <div className={s.modalHead}>
              <h2 className={s.modalTitle}>{modal === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}</h2>
              <button onClick={() => setModal(null)} className={s.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={s.modalBody}>
              <div>
                <label className={s.label}>Biểu tượng (Icon)</label>
                <div className={s.iconList}>
                  {ICON_OPTIONS.map((ic) => (
                    <button
                      key={ic}
                      onClick={() => {
                        setForm((f) => ({ ...f, icon: ic }));
                        setFile(null);
                        setPreview(null);
                      }}
                      className={clsx(s.iconOption, form.icon === ic && !file && s.iconOptionActive)}
                    >
                      <img src={`/${ic}.png`} alt="" className={s.iconOptionImg} />
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="file"
                    id="cat-image"
                    className={s.hidden}
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
                  <label htmlFor="cat-image" className={clsx(s.uploadLabel, (file || preview) && s.uploadActive)}>
                    <div className={s.thumb}>
                      {preview ? <img src={preview} alt="preview" className={s.thumbImg} /> : <ImageIcon size={24} className={s.thumbPlaceholder} />}
                    </div>
                    <div className={s.uploadMain}>
                      <p className={s.uploadTitle}>{file ? "Đã chọn ảnh mới" : preview ? "Ảnh hiện tại" : "Tải ảnh icon mới"}</p>
                      <p className={s.uploadDesc}>Dung lượng tối đa 50MB</p>
                    </div>
                    <Upload size={18} className={s.uploadIcon} />
                  </label>
                  {(file || preview) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setPreview(null);
                        setForm((f) => ({ ...f, icon: "🏷️" }));
                      }}
                      className={s.removeBtn}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <div className={s.grid2}>
                <div>
                  <label className={s.label}>Tên tiếng Việt *</label>
                  <input value={form.name} onChange={setField("name")} className={s.input} placeholder="VD: Nông nghiệp" />
                </div>
                <div>
                  <label className={s.label}>Tên tiếng Anh</label>
                  <input value={form.nameEn} onChange={setField("nameEn")} className={s.input} placeholder="VD: Agriculture" />
                </div>
              </div>

              <div>
                <label className={s.label}>Mô tả ngắn</label>
                <textarea value={form.description} onChange={setField("description")} className={s.textarea} placeholder="Giới thiệu về ngành nghề này..." />
              </div>

              <div className={s.row}>
                <div className={s.grow}>
                  <label className={s.label}>Thứ tự ưu tiên</label>
                  <input type="number" value={form.sortOrder} onChange={setField("sortOrder")} className={s.input} />
                </div>
                <label className={s.toggleLabel}>
                  <div className={clsx(s.track, form.isActive ? s.trackOn : s.trackOff)}>
                    <div className={clsx(s.thumbSmall, form.isActive ? s.thumbOn : s.thumbOff)} />
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className={s.hidden}
                  />
                  <span className={s.toggleText}>Hiển thị</span>
                </label>
              </div>
            </div>

            <div className={clsx(s.footActions, "fl-surface-muted-30")}>
              <button onClick={() => setModal(null)} className={s.cancelBtn}>Hủy</button>
              <button onClick={handleSave} disabled={saving} className={clsx("btn-primary", s.saveBtn)}>
                {saving ? <Loader2 size={16} className={s.spin} /> : <CheckCircle size={16} />}
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
