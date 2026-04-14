import { useState, useRef, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus, Pencil, Trash2, X,
  Eye, EyeOff, Upload, Image as ImageIcon,
  BookOpen, Loader2, Link as LinkIcon,
} from "lucide-react";
import RichTextEditor from "@/admin/components/RichTextEditor";
import type { News } from "@/core/types";
import { formatDate } from "@/core/utils/helpers";
import toast from "react-hot-toast";
import { newsApi, getImageUrl } from "@/core/services/api";

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
  title: "", slug: "", excerpt: "", content: "", isPublished: true, imagePreview: "",
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

  useEffect(() => { loadItems(); }, []);

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
    if (file.size > 5 * 1024 * 1024) { toast.error("Ảnh tối đa 5MB"); return; }
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
    if (!form.title) { toast.error("Vui lòng nhập tiêu đề"); return; }
    if (!form.slug) { toast.error("Vui lòng nhập slug"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("type", "handbook");
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("isPublished", form.isPublished ? "true" : "false");
      if (fileObj.current) {
        fd.append("image", fileObj.current);
      } else if (imgTab === "url" && urlInput.trim()) {
        fd.set("image", urlInput.trim());
      }
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

  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors duration-300";
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="text-amber-600 dark:text-brand-gold" />
            Quản lý Cẩm nang
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1 font-medium">
            {items.length} bài viết ·{" "}
            <span className="text-green-600 dark:text-green-400 font-bold">
              {items.filter((n) => n.isPublished).length} bài công khai
            </span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Thêm bài cẩm nang
        </button>
      </div>

      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-5 py-4 w-16 text-center">Ảnh</th>
                <th className="text-left px-5 py-4">Nội dung bài viết</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">Slug (URL)</th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">Ngày tạo</th>
                <th className="text-left px-5 py-4">Trạng thái</th>
                <th className="text-right px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-8 text-center">
                      <Loader2 className="animate-spin inline-block text-amber-500" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 font-medium italic">
                    Chưa có bài cẩm nang nào — hãy thêm bài đầu tiên!
                  </td>
                </tr>
              ) : (
                items.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-brand-dark border border-slate-200 dark:border-white/5 flex-shrink-0 shadow-sm">
                        {n.image ? (
                          <img src={getImageUrl(n.image)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-brand-muted">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
                        {n.title}
                      </p>
                      {n.excerpt && (
                        <p className="text-slate-400 dark:text-brand-muted text-[11px] font-medium line-clamp-1 mt-0.5 italic">
                          "{n.excerpt}"
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <code className="text-[10px] font-bold text-amber-700 dark:text-brand-gold bg-amber-50 dark:bg-brand-gold/10 border border-amber-200 dark:border-brand-gold/30 px-2 py-1 rounded-md uppercase tracking-tighter">
                        /{n.slug}
                      </code>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-slate-500 dark:text-brand-muted text-xs font-medium">{formatDate(n.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(n)}
                        className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full border font-black uppercase tracking-widest transition-all ${
                          n.isPublished
                            ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                            : "text-slate-400 bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {n.isPublished ? <><Eye size={12} /> Công khai</> : <><EyeOff size={12} /> Đang ẩn</>}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(n)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleting(n.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all">
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

      {/* ── Full-screen Editor ── */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-50 dark:bg-[#0d1117] animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 bg-white dark:bg-brand-card border-b border-slate-200 dark:border-white/5 shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors" title="Quay lại">
                <X size={20} />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
                  {modal === "add" ? "Tạo bài cẩm nang mới" : "Đang chỉnh sửa cẩm nang"}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[300px]">
                  {form.title || "Chưa có tiêu đề"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className={`w-2 h-2 rounded-full ${form.isPublished ? "bg-green-500" : "bg-slate-400"}`} />
                {form.isPublished ? "Sẵn sàng công khai" : "Bản nháp"}
              </div>
              <button onClick={() => setModal(null)} className="px-6 py-2 text-sm font-bold text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all rounded-xl border border-slate-200 dark:border-white/5">
                Hủy bỏ
              </button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-2 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 min-w-[140px]">
                {saving ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : modal === "add" ? "Đăng ngay" : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-brand-dark/50 custom-scrollbar relative p-4 md:p-12 lg:p-20">
              <div className="max-w-4xl mx-auto bg-white dark:bg-brand-card min-h-[141.4%] shadow-2xl rounded-3xl border border-slate-200 dark:border-white/5">
                <div className="p-12 md:p-20 border-b border-slate-50 dark:border-white/5 bg-slate-50/30">
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Cẩm nang định cư & Visa</span>
                  </div>
                  <input
                    value={form.title}
                    onChange={setField("title")}
                    placeholder="Nhập tiêu đề bài cẩm nang tại đây..."
                    className="w-full text-4xl md:text-6xl font-black bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-white/10 leading-tight tracking-tighter mb-4"
                  />
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <span>{formatDate(new Date().toISOString())}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>Ban biên tập FLY LABOUR</span>
                  </div>
                </div>
                <RichTextEditor
                  value={form.content}
                  onChange={(val) => setForm((f) => ({ ...f, content: val }))}
                  placeholder="Viết nội dung cẩm nang tại đây..."
                  className="!border-none !rounded-none min-h-[1000px]"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 h-full bg-white dark:bg-brand-card border-l border-slate-200 dark:border-white/5 overflow-y-auto p-6 space-y-8 custom-scrollbar shrink-0 hidden xl:block">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5 pb-2">Cấu hình bài viết</h3>
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 cursor-pointer group transition-all hover:border-brand-gold">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Công khai bài viết</span>
                    <span className="text-[10px] text-slate-500 font-medium">Hiện thị trên trang cẩm nang</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${form.isPublished ? "bg-green-500" : "bg-slate-300"}`}>
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.isPublished ? "left-6" : "left-1"}`} />
                    <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} className="hidden" />
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Đường dẫn (Slug)</h3>
                  <code className="text-[9px] text-brand-gold font-bold">flylabour.vn/news/...</code>
                </div>
                <input value={form.slug} onChange={setField("slug")} className={inputClasses + " h-10 font-mono text-[11px]"} placeholder="cam-nang-thi-thuc-uc" />
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Hình ảnh đại diện</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 group shadow-inner">
                  {form.imagePreview ? (
                    <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-brand-muted gap-2">
                      <ImageIcon size={32} className="opacity-20" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh</p>
                    </div>
                  )}
                  {form.imagePreview && (
                    <button onClick={() => { setForm((f) => ({ ...f, imagePreview: "" })); setUrlInput(""); fileObj.current = null; }} className="absolute top-2 right-2 bg-red-600/80 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { setImgTab("upload"); fileRef.current?.click(); }} className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl hover:border-brand-gold hover:bg-brand-gold/5 transition-all group">
                    <Upload size={18} className="text-slate-400 group-hover:text-brand-gold mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tải lên</span>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </button>
                  <button onClick={() => setImgTab("url")} className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${imgTab === "url" ? "bg-brand-gold/10 border-brand-gold/50" : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-brand-gold"}`}>
                    <LinkIcon size={18} className={`mb-2 ${imgTab === "url" ? "text-brand-gold" : "text-slate-400"}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Dùng Link</span>
                  </button>
                </div>
                {imgTab === "url" && (
                  <div className="flex gap-1 animate-in slide-in-from-top-2 duration-300">
                    <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className={inputClasses + " h-9 text-xs !rounded-l-xl !rounded-r-none border-r-0"} placeholder="https://..." />
                    <button onClick={applyUrl} className="bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 px-3 rounded-r-xl font-bold text-[10px] uppercase">OK</button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tóm tắt (Trích dẫn)</h3>
                <textarea value={form.excerpt} onChange={setField("excerpt")} className={inputClasses + " py-3 h-32 resize-none text-xs leading-relaxed"} placeholder="Mô tả súc tích cho bài cẩm nang này..." />
              </div>

              <div className="pt-8 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Bài cẩm nang sẽ hiển thị<br />tại trang /handbook</p>
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
