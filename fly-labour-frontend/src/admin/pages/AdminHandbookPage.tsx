import { useState, useRef, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import AdminRichTextEditor from "@/admin/components/AdminRichTextEditor";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  BookOpen,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import type { News } from "@core/types";
import { formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import { newsApi, getImageUrl } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminHandbookPage.module.scss";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

type FormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  imagePreview: string;
};

const EMPTY: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  isPublished: true,
  imagePreview: "",
};

export default function AdminHandbookPage() {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObj = useRef<File | null>(null);

  const loadItems = () => {
    setLoading(true);
    newsApi
      .getAllHandbookAdmin()
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setUrlInput("");
    fileObj.current = null;
    setModal("add");
  };

  const openEdit = (n: News) => {
    setForm({
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt || "",
      content: n.content || "",
      isPublished: n.isPublished,
      imagePreview: n.image || "",
    });
    setUrlInput(n.image?.startsWith("http") ? n.image : "");
    fileObj.current = null;
    setEditing(n);
    setModal("edit");
  };

  const setField =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((f) => ({
        ...f,
        [k]: val,
        ...(k === "title" && !editing ? { slug: slugify(val) } : {}),
      }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh tối đa 5MB");
      return;
    }
    fileObj.current = file;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    fileObj.current = null;
    setForm((f) => ({ ...f, imagePreview: urlInput.trim() }));
    toast.success("Đã áp dụng URL ảnh");
  };

  const handleSave = async () => {
    if (!form.title) return toast.error("Vui lòng nhập tiêu đề");
    if (!form.slug) return toast.error("Vui lòng nhập slug");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("type", "handbook");
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("isPublished", form.isPublished ? "true" : "false");
      if (fileObj.current) fd.append("image", fileObj.current);
      else if (imgTab === "url" && urlInput.trim()) fd.set("image", urlInput.trim());

      if (modal === "edit" && editing) {
        await newsApi.update(editing.id, fd);
        toast.success("Đã cập nhật bài viết cẩm nang");
      } else {
        await newsApi.create(fd);
        toast.success("Đã thêm bài cẩm nang mới");
      }
      setModal(null);
      loadItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await newsApi.remove(id);
      toast.success("Đã xóa bài cẩm nang");
      setDeleting(null);
      loadItems();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleTogglePublish = async (n: News) => {
    try {
      const fd = new FormData();
      fd.append("isPublished", (!n.isPublished).toString());
      await newsApi.update(n.id, fd);
      loadItems();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>
            <BookOpen className={s.titleIcon} />
            Quản lý Cẩm nang
          </h1>
          <p className={s.sub}>
            {items.length} bài viết ·{" "}
            <span className={s.subAccent}>{items.filter((n) => n.isPublished).length} bài công khai</span>
          </p>
        </div>
        <button onClick={openAdd} className={clsx("btn-primary", s.addBtn)}>
          <Plus size={18} /> Thêm bài cẩm nang
        </button>
      </div>

      <div className={s.card}>
        <div className={clsx(s.tableWrap, "custom-scrollbar")}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                <th className={clsx(s.th, s.thCenter)}>Ảnh</th>
                <th className={s.th}>Nội dung bài viết</th>
                <th className={clsx(s.th, s.hideMd)}>Slug (URL)</th>
                <th className={clsx(s.th, s.hideSm)}>Ngày tạo</th>
                <th className={s.th}>Trạng thái</th>
                <th className={clsx(s.th, s.thRight)}>Thao tác</th>
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className={s.loadingCell}>
                      <Loader2 className={s.spin} />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className={s.emptyCell}>
                    Chưa có bài cẩm nang nào — hãy thêm bài đầu tiên!
                  </td>
                </tr>
              ) : (
                items.map((n) => (
                  <tr key={n.id} className={s.row}>
                    <td className={clsx(s.th, s.tdCenter)}>
                      <div className={s.thumbWrap}>
                        {n.image ? (
                          <img src={getImageUrl(n.image)} alt="" className={s.thumb} />
                        ) : (
                          <div className={s.thumbEmpty}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={s.th}>
                      <p className={s.titleLine}>{n.title}</p>
                      {n.excerpt && <p className={s.excerpt}>"{n.excerpt}"</p>}
                    </td>
                    <td className={clsx(s.th, s.hideMd)}>
                      <code className={s.slug}>/{n.slug}</code>
                    </td>
                    <td className={clsx(s.th, s.hideSm)}>
                      <p className={s.date}>{formatDate(n.createdAt)}</p>
                    </td>
                    <td className={s.th}>
                      <button
                        onClick={() => handleTogglePublish(n)}
                        className={clsx(s.statusBtn, n.isPublished ? s.statusOn : s.statusOff)}
                      >
                        {n.isPublished ? (
                          <>
                            <Eye size={12} /> Công khai
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} /> Đang ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className={clsx(s.th, s.tdRight)}>
                      <div className={s.actions}>
                        <button onClick={() => openEdit(n)} className={clsx(s.iconBtn, s.editBtn)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleting(n.id)}
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
        <div className={s.modalRoot}>
          <div className={s.modalHead}>
            <div className={s.headLeft}>
              <button onClick={() => setModal(null)} className={s.closeIconBtn} title="Quay lại">
                <X size={20} />
              </button>
              <div className={s.divider} />
              <div className={s.headLabelWrap}>
                <span className={s.headLabelTop}>
                  {modal === "add" ? "Tạo bài cẩm nang mới" : "Đang chỉnh sửa cẩm nang"}
                </span>
                <span className={s.headTitle}>{form.title || "Chưa có tiêu đề"}</span>
              </div>
            </div>
            <div className={s.headRight}>
              <div className={s.publishBadge}>
                <div className={clsx(s.publishDot, form.isPublished ? s.dotOn : s.dotOff)} />
                {form.isPublished ? "Sẵn sàng công khai" : "Bản nháp"}
              </div>
              <button onClick={() => setModal(null)} className={s.cancelBtn}>
                Hủy bỏ
              </button>
              <button onClick={handleSave} disabled={saving} className={clsx("btn-primary", s.saveBtn)}>
                {saving ? <Loader2 className={s.saveSpin} /> : modal === "add" ? "Đăng ngay" : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          <div className={s.workspace}>
            <div className={clsx(s.editorArea, "custom-scrollbar")}>
              <div className={s.paper}>
                <div className={s.paperHead}>
                  <div className={s.kindRow}>
                    <BookOpen size={14} className={s.titleIcon} />
                    <span className={s.kindText}>Cẩm nang định cư & Visa</span>
                  </div>
                  <input
                    value={form.title}
                    onChange={setField("title")}
                    placeholder="Nhập tiêu đề bài cẩm nang tại đây..."
                    className={s.titleInput}
                  />
                  <div className={s.metaRow}>
                    <span>{formatDate(new Date().toISOString())}</span>
                    <span className={s.metaDot} />
                    <span>Ban biên tập FLY LABOUR</span>
                  </div>
                </div>
                <div className={s.editorWrap}>
                  <AdminRichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Soạn nội dung cẩm nang — định dạng như Word, chèn ảnh và bảng từ thanh công cụ phía trên…"
                  />
                </div>
              </div>
            </div>

            <div className={clsx(s.sidebar, "custom-scrollbar")}>
              <div className={s.section}>
                <h3 className={clsx(s.sectionTitle, s.sectionTitleLine)}>Cấu hình bài viết</h3>
                <label className={s.toggleRow}>
                  <div>
                    <span className={s.toggleLabelMain}>Công khai bài viết</span>
                    <p className={s.toggleLabelSub}>Hiện thị trên trang cẩm nang</p>
                  </div>
                  <div className={clsx(s.toggleTrack, form.isPublished ? s.toggleTrackOn : s.toggleTrackOff)}>
                    <div className={clsx(s.toggleThumb, form.isPublished ? s.thumbOn : s.thumbOff)} />
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                      className={s.hiddenInput}
                    />
                  </div>
                </label>
              </div>

              <div className={s.section}>
                <div className={s.slugTop}>
                  <h3 className={s.sectionTitle}>Đường dẫn (Slug)</h3>
                  <code className={s.slugCode}>flylabour.vn/news/...</code>
                </div>
                <input
                  value={form.slug}
                  onChange={setField("slug")}
                  className={clsx(s.field, s.mono)}
                  placeholder="cam-nang-thi-thuc-uc"
                />
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Hình ảnh đại diện</h3>
                <div className={s.imagePreview}>
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="preview" className={s.imageObj} />
                  ) : (
                    <div className={s.imageEmpty}>
                      <ImageIcon size={32} />
                      <p className={s.imageEmptyText}>Chưa có ảnh</p>
                    </div>
                  )}
                  {form.imagePreview && (
                    <button
                      onClick={() => {
                        setForm((f) => ({ ...f, imagePreview: "" }));
                        setUrlInput("");
                        fileObj.current = null;
                      }}
                      className={s.removeImgBtn}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className={s.uploadGrid}>
                  <button
                    onClick={() => {
                      setImgTab("upload");
                      fileRef.current?.click();
                    }}
                    className={s.uploadOpt}
                  >
                    <Upload size={18} className={s.uploadOptIcon} />
                    <span className={s.uploadOptLabel}>Tải lên</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className={s.hiddenInput}
                      onChange={handleFileChange}
                    />
                  </button>
                  <button
                    onClick={() => setImgTab("url")}
                    className={clsx(s.uploadOpt, imgTab === "url" && s.uploadOptActive)}
                  >
                    <LinkIcon size={18} className={s.uploadOptIcon} />
                    <span className={s.uploadOptLabel}>Dùng Link</span>
                  </button>
                </div>

                {imgTab === "url" && (
                  <div className={s.urlRow}>
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className={clsx(s.field, s.urlInput)}
                      placeholder="https://..."
                    />
                    <button onClick={applyUrl} className={s.okBtn}>
                      OK
                    </button>
                  </div>
                )}
              </div>

              <div className={s.section}>
                <h3 className={s.sectionTitle}>Tóm tắt (Trích dẫn)</h3>
                <textarea
                  value={form.excerpt}
                  onChange={setField("excerpt")}
                  className={s.textArea}
                  placeholder="Mô tả súc tích cho bài cẩm nang này..."
                />
              </div>

              <div className={s.tip}>
                Bài cẩm nang sẽ hiển thị
                <br />
                tại trang /handbook
              </div>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Bài cẩm nang này sẽ bị xóa vĩnh viễn khỏi hệ thống."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
