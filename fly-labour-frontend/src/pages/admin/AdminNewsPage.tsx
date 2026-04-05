import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import type { News } from "@/types";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";
import { newsApi, getImageUrl } from "@/services/api";

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

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
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

  const loadNews = () => {
    setLoading(true);
    newsApi
      .getAllAdmin()
      .then((r) => setNews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNews();
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
    reader.onload = () =>
      setForm((f) => ({ ...f, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    fileObj.current = null;
    setForm((f) => ({ ...f, imagePreview: urlInput.trim() }));
    toast.success("Đã áp dụng URL ảnh");
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!form.slug) {
      toast.error("Vui lòng nhập slug");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("isPublished", form.isPublished ? "true" : "false");

      if (fileObj.current) {
        fd.append("image", fileObj.current);
      } else if (imgTab === "url" && urlInput.trim()) {
        fd.append("image", urlInput.trim());
      }

      if (modal === "edit" && editing) {
        await newsApi.update(editing.id, fd);
        toast.success("Đã cập nhật bài viết");
      } else {
        await newsApi.create(fd);
        toast.success("Đã đăng bài viết");
      }
      setModal(null);
      loadNews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await newsApi.remove(id);
      toast.success("Đã xóa bài viết");
      setDeleting(null);
      loadNews();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleTogglePublish = async (n: News) => {
    try {
      const fd = new FormData();
      fd.append("isPublished", (!n.isPublished).toString());
      await newsApi.update(n.id, fd);
      loadNews();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý Tin tức</h1>
          <p className="text-brand-muted text-sm">
            {news.length} bài viết · {news.filter((n) => n.isPublished).length}{" "}
            đã đăng
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5"
        >
          <Plus size={15} /> Thêm bài viết
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-dark/50">
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold w-12">
                  Ảnh
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Tiêu đề
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">
                  Ngày tạo
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Trạng thái
                </th>
                <th className="text-right px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-brand-muted text-sm"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-brand-muted text-sm"
                  >
                    Chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                news.map((n) => (
                  <tr
                    key={n.id}
                    className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-dark border border-brand-border flex-shrink-0">
                        {n.image ? (
                          <img
                            src={getImageUrl(n.image)}
                            alt={n.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-muted">
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {n.title}
                      </p>
                      {n.excerpt && (
                        <p className="text-brand-muted text-xs line-clamp-1 mt-0.5">
                          {n.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <code className="text-xs text-brand-gold bg-brand-gold/5 px-2 py-0.5 rounded">
                        {n.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-brand-muted text-xs">
                      {formatDate(n.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTogglePublish(n)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${n.isPublished ? "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20" : "text-brand-gray-700 dark:text-brand-gray-300 bg-brand-gray-100 dark:bg-brand-gray-800 border-brand-gray-300 dark:border-brand-gray-700 hover:border-brand-gray-400 dark:hover:border-brand-gray-700"}`}
                      >
                        {n.isPublished ? (
                          <>
                            <Eye size={11} /> Đã đăng
                          </>
                        ) : (
                          <>
                            <EyeOff size={11} /> Ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(n)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleting(n.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={13} />
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

      {/* ── Modal Thêm / Sửa ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModal(null)}
          />
          <div className="relative bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border sticky top-0 bg-brand-card z-10">
              <h2 className="font-semibold text-white">
                {modal === "add" ? "📰 Thêm bài viết" : "✏️ Chỉnh sửa bài viết"}
              </h2>
              <button onClick={() => setModal(null)}>
                <X size={18} className="text-brand-muted hover:text-white" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* ── ẢNH ── */}
              <div className="space-y-3">
                <label className="text-xs text-brand-muted font-semibold uppercase tracking-wider block">
                  Ảnh bài viết
                </label>

                {/* Preview */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-brand-border bg-brand-dark">
                  {form.imagePreview ? (
                    <>
                      <img
                        src={form.imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={() =>
                          setForm((f) => ({ ...f, imagePreview: "" }))
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <button
                          onClick={() => {
                            setForm((f) => ({ ...f, imagePreview: "" }));
                            setUrlInput("");
                            fileObj.current = null;
                          }}
                          className="text-xs bg-red-500/80 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <X size={11} /> Xóa ảnh
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted gap-2">
                      <ImageIcon size={32} className="opacity-30" />
                      <p className="text-xs">Chưa có ảnh</p>
                    </div>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1.5 text-xs">
                  <button
                    onClick={() => setImgTab("upload")}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${imgTab === "upload" ? "bg-brand-gold/15 border-brand-gold/30 text-brand-gold" : "border-brand-border text-brand-muted hover:text-white"}`}
                  >
                    📁 Upload từ máy
                  </button>
                  <button
                    onClick={() => setImgTab("url")}
                    className={`px-3 py-1.5 rounded-lg border transition-colors ${imgTab === "url" ? "bg-brand-gold/15 border-brand-gold/30 text-brand-gold" : "border-brand-border text-brand-muted hover:text-white"}`}
                  >
                    🔗 Nhập URL ảnh
                  </button>
                </div>

                {imgTab === "upload" && (
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-brand-border hover:border-brand-gold/40 rounded-xl py-4 flex flex-col items-center gap-2 text-brand-muted hover:text-white transition-all duration-200 group"
                    >
                      <Upload
                        size={20}
                        className="group-hover:text-brand-gold transition-colors"
                      />
                      <span className="text-sm">Nhấn để chọn ảnh</span>
                      <span className="text-xs opacity-60">
                        JPG, PNG, WEBP — tối đa 5MB
                      </span>
                    </button>
                  </div>
                )}

                {imgTab === "url" && (
                  <div className="flex gap-2">
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                      className="input-dark flex-1 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      onClick={applyUrl}
                      className="btn-primary px-4 text-sm whitespace-nowrap"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {/* ── NỘI DUNG ── */}
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  Tiêu đề *
                </label>
                <input
                  value={form.title}
                  onChange={setField("title")}
                  className="input-dark"
                  placeholder="Tiêu đề bài viết..."
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  Slug (URL)
                </label>
                <input
                  value={form.slug}
                  onChange={setField("slug")}
                  className="input-dark font-mono text-sm"
                  placeholder="ten-bai-viet"
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  Tóm tắt
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={setField("excerpt")}
                  className="input-dark h-20 resize-none"
                  placeholder="Mô tả ngắn hiển thị ở danh sách..."
                />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">
                  Nội dung bài viết
                </label>
                <textarea
                  value={form.content}
                  onChange={setField("content")}
                  className="input-dark h-48 resize-none"
                  placeholder="Nội dung chi tiết bài viết..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPublished: e.target.checked }))
                  }
                  className="w-4 h-4 accent-brand-gold"
                />
                <span className="text-sm text-white">
                  Đăng ngay (hiển thị công khai)
                </span>
              </label>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  <CheckCircle size={15} />{" "}
                  {saving
                    ? "Đang lưu..."
                    : modal === "add"
                      ? "Đăng bài"
                      : "Lưu thay đổi"}
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="btn-outline px-6"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete ── */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          />
          <div className="relative bg-brand-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-white font-semibold mb-2">Xác nhận xóa?</h3>
            <p className="text-brand-muted text-sm mb-5">
              Bài viết sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleting)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleting(null)}
                className="flex-1 btn-outline py-2.5 text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
