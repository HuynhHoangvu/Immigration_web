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
  GraduationCap,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import type { News } from "@core/types";
import { formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import { newsApi, getImageUrl } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminStudyProgramsPage.module.scss";

const COUNTRIES = [
  { value: "australia", label: "🇦🇺 Úc" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "new_zealand", label: "🇳🇿 New Zealand" },
  { value: "germany", label: "🇩🇪 Đức" },
  { value: "us", label: "🇺🇸 Mỹ" },
  { value: "uk", label: "🇬🇧 Anh" },
  { value: "japan", label: "🇯🇵 Nhật Bản" },
  { value: "south_korea", label: "🇰🇷 Hàn Quốc" },
  { value: "singapore", label: "🇸🇬 Singapore" },
  { value: "taiwan", label: "🇹🇼 Đài Loan" },
];

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
  country: string;
  priceFrom: string;
  priceTo: string;
  priceCurrency: string;
  itinerary: string;
  registerUrl: string;
  studyType: string;
};

const EMPTY: FormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  isPublished: true,
  imagePreview: "",
  country: "",
  priceFrom: "",
  priceTo: "",
  priceCurrency: "VND",
  itinerary: "",
  registerUrl: "",
  studyType: "",
};

export default function AdminStudyProgramsPage() {
  const inputClasses = "w-full text-sm rounded-xl px-4 bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-amber-400 outline-none transition-all";

  const getPreviewUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return getImageUrl(path);
  };

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
      .getAllStudyAdmin()
      .then((r) => {
        // Lọc ra các đơn du học (các bài đăng có gắn quốc gia)
        const programs = r.data.filter((n: News) => !!n.country);
        setItems(programs);
      })
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
      country: n.country || "",
      priceFrom: n.priceFrom?.toString() || "",
      priceTo: n.priceTo?.toString() || "",
      priceCurrency: n.priceCurrency || "VND",
      itinerary: n.itinerary || "",
      registerUrl: n.registerUrl || "",
      studyType: n.studyType || "",
    });
    setUrlInput(n.image?.startsWith("http") ? n.image : "");
    fileObj.current = null;
    setEditing(n);
    setModal("edit");
  };

  const setField =
    (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!form.country) return toast.error("Vui lòng chọn quốc gia du học");
    if (!form.studyType) return toast.error("Vui lòng chọn loại hình du học");

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("type", "study");
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.content) fd.append("content", form.content);
      fd.append("isPublished", form.isPublished ? "true" : "false");
      fd.append("country", form.country);
      fd.append("studyType", form.studyType);
      if (form.priceFrom) fd.append("priceFrom", form.priceFrom);
      if (form.priceTo) fd.append("priceTo", form.priceTo);
      fd.append("priceCurrency", form.priceCurrency);
      fd.append("itinerary", form.itinerary);
      fd.append("registerUrl", form.registerUrl);

      if (fileObj.current) fd.append("image", fileObj.current);
      else if (imgTab === "url" && urlInput.trim()) fd.set("image", urlInput.trim());

      if (modal === "edit" && editing) {
        await newsApi.update(editing.id, fd);
        toast.success("Đã cập nhật đơn du học");
      } else {
        await newsApi.create(fd);
        toast.success("Đã đăng đơn du học mới");
      }
      setModal(null);
      loadItems();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu đơn du học");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await newsApi.remove(id);
      toast.success("Đã xóa đơn du học");
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
            <GraduationCap className={s.titleIcon} />
            Quản lý Đơn Du học
          </h1>
          <p className={s.sub}>
            {items.length} đơn tuyển sinh du học ·{" "}
            <span className={s.subAccent}>{items.filter((n) => n.isPublished).length} đơn công khai</span>
          </p>
        </div>
        <button onClick={openAdd} className={clsx("btn-primary", s.addBtn)}>
          <Plus size={18} /> Đăng đơn du học mới
        </button>
      </div>

      <div className={s.card}>
        <div className={clsx(s.tableWrap, "custom-scrollbar")}>
          <table className={s.table}>
            <thead className={s.thead}>
              <tr>
                <th className={clsx(s.th, s.thCenter)}>Ảnh</th>
                <th className={s.th}>Trường học / Đơn tuyển sinh</th>
                <th className={clsx(s.th, s.hideSm)}>Quốc gia</th>
                <th className={clsx(s.th, s.hideMd)}>Học phí / Chi phí</th>
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
                    Chưa có đơn du học nào — hãy đăng đơn đầu tiên!
                  </td>
                </tr>
              ) : (
                items.map((n) => {
                  const countryObj = COUNTRIES.find((c) => c.value === n.country);
                  return (
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
                        <div className="flex gap-2 items-center mt-1">
                          {n.studyType === "university" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              🎓 Đại học
                            </span>
                          )}
                          {n.studyType === "college" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                              🏫 Cao đẳng
                            </span>
                          )}
                          {n.studyType === "vocational" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              💼 Du học nghề
                            </span>
                          )}
                        </div>
                        {n.excerpt && <p className={s.excerpt}>"{n.excerpt}"</p>}
                      </td>
                      <td className={clsx(s.th, s.hideSm)}>
                        {countryObj ? (
                          <span className="font-semibold text-slate-700">{countryObj.label}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className={clsx(s.th, s.hideMd)}>
                        {n.priceFrom || n.priceTo ? (
                          <span className="text-sm font-semibold text-amber-700">
                            {n.priceFrom ? `${Number(n.priceFrom).toLocaleString()} ` : "0 "}
                            {n.priceTo ? ` - ${Number(n.priceTo).toLocaleString()} ` : ""}
                            {n.priceCurrency || "VND"}
                          </span>
                        ) : (
                          <span className="text-slate-400">Miễn phí / Chưa rõ</span>
                        )}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Add/Edit Modal ══ */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl fl-max-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <GraduationCap className="text-amber-600" />
                {modal === "add" ? "Đăng đơn du học mới" : "Chỉnh sửa đơn du học"}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* 1. Hình ảnh & Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100">
                {/* Image Section */}
                <div className="md:col-span-4 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Hình đại diện *
                  </label>
                  <div className="relative w-full aspect-video md:aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    {form.imagePreview ? (
                      <img src={getPreviewUrl(form.imagePreview)} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                        <ImageIcon size={30} className="opacity-20" />
                        <p className="text-[10px] font-medium">Chưa có ảnh</p>
                      </div>
                    )}
                    {form.imagePreview && (
                      <button
                        onClick={() => {
                          setForm((f) => ({ ...f, imagePreview: "" }));
                          setUrlInput("");
                          fileObj.current = null;
                        }}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-xl shadow-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImgTab("upload")}
                      className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition-all ${
                        imgTab === "upload"
                          ? "bg-slate-900 text-white border-transparent shadow-sm"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      TẢI LÊN
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgTab("url")}
                      className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition-all ${
                        imgTab === "url"
                          ? "bg-slate-900 text-white border-transparent shadow-sm"
                          : "bg-white text-slate-500 border-slate-200"
                      }`}
                    >
                      LINK URL
                    </button>
                  </div>
                  {imgTab === "upload" ? (
                    <label className="w-full border-2 border-dashed border-slate-100 hover:border-amber-400 rounded-xl py-2 flex flex-col items-center gap-1 text-slate-400 hover:text-amber-600 transition-all cursor-pointer">
                      <Upload size={14} /> <span className="text-[9px] font-bold">CHỌN TỆP</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <input
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        if (e.target.value.includes(".")) setForm((f) => ({ ...f, imagePreview: e.target.value }));
                      }}
                      className={`${inputClasses} h-8 text-[10px]`}
                      placeholder="Paste URL..."
                    />
                  )}
                </div>

                {/* Form fields right */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên trường / Chương trình tuyển sinh *</label>
                    <input
                      value={form.title}
                      onChange={setField("title")}
                      className={`${inputClasses} h-11 text-base font-bold`}
                      placeholder="VD: Đại học Quốc gia Úc (ANU)"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đường dẫn tĩnh (Slug) *</label>
                    <input
                      value={form.slug}
                      onChange={setField("slug")}
                      className={`${inputClasses} h-10 font-mono text-xs`}
                      placeholder="dai-hoc-quoc-gia-uc"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quốc gia du học *</label>
                      <select
                        value={form.country}
                        onChange={setField("country")}
                        className={`${inputClasses} h-11 appearance-none`}
                      >
                        <option value="">-- Chọn quốc gia --</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bậc học / Loại hình *</label>
                      <select
                        value={form.studyType}
                        onChange={setField("studyType")}
                        className={`${inputClasses} h-11 appearance-none`}
                      >
                        <option value="">-- Chọn loại hình --</option>
                        <option value="university">🎓 Đại học (Bachelor/Master)</option>
                        <option value="college">🏫 Cao đẳng (College)</option>
                        <option value="vocational">💼 Du học nghề / Lao động (Vocational)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Tài chính & Kỳ tuyển sinh */}
              <div className="space-y-6 pb-6 border-b border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Tuition range */}
                  <div className="md:col-span-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Học phí dự kiến / năm</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">TỪ (Tối thiểu)</label>
                        <input
                          type="number"
                          value={form.priceFrom}
                          onChange={setField("priceFrom")}
                          className={`${inputClasses} h-10`}
                          placeholder="Ví dụ: 15000"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">ĐẾN (Tối đa)</label>
                        <input
                          type="number"
                          value={form.priceTo}
                          onChange={setField("priceTo")}
                          className={`${inputClasses} h-10`}
                          placeholder="Ví dụ: 25000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Currency */}
                  <div className="md:col-span-4 space-y-1.5 justify-end flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại tiền tệ</label>
                    <select
                      value={form.priceCurrency}
                      onChange={setField("priceCurrency")}
                      className={`${inputClasses} h-11 appearance-none`}
                    >
                      <option value="VND">🇻🇳 VND – Việt Nam Đồng</option>
                      <option value="AUD">🇦🇺 AUD – Đô la Úc</option>
                      <option value="CAD">🇨🇦 CAD – Đô la Canada</option>
                      <option value="NZD">🇳🇿 NZD – Đô la New Zealand</option>
                      <option value="USD">🇺🇸 USD – Đô la Mỹ</option>
                      <option value="EUR">🇪🇺 EUR – Euro</option>
                      <option value="KRW">🇰🇷 KRW – Won Hàn Quốc</option>
                      <option value="JPY">🇯🇵 JPY – Yên Nhật</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kỳ nhập học / Lịch trình</label>
                    <input
                      value={form.itinerary}
                      onChange={setField("itinerary")}
                      className={`${inputClasses} h-11`}
                      placeholder="VD: Tháng 2 và Tháng 7 hàng năm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link đăng ký trực tiếp</label>
                    <input
                      value={form.registerUrl}
                      onChange={setField("registerUrl")}
                      className={`${inputClasses} h-11`}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* 3. Tóm tắt ngắn & Trạng thái */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tóm tắt ngắn (Excerpt)</label>
                  <textarea
                    value={form.excerpt}
                    onChange={setField("excerpt")}
                    className={`${inputClasses} h-20 py-2 resize-none text-xs`}
                    placeholder="Mô tả súc tích đơn tuyển sinh du học này..."
                  />
                </div>

                <div className="md:col-span-4 space-y-3 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cấu hình hiển thị</span>
                  <label className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-3 rounded-2xl cursor-pointer group hover:border-amber-400 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                      className="w-5 h-5 accent-amber-500 rounded-lg shadow-sm cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-amber-600 transition-colors">CÔNG KHAI</span>
                      <span className="text-[9px] text-slate-400">Hiển thị lên trang chủ du học</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 4. Nội dung chi tiết */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nội dung giới thiệu chi tiết *</label>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <AdminRichTextEditor
                    value={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                    placeholder="Soạn nội dung tuyển sinh chi tiết — giới thiệu trường, ngành học, điều kiện tuyển sinh, học bổng..."
                  />
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-slate-100 fl-surface-muted-50 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="flex-1 h-12 rounded-2xl font-bold border border-slate-200 text-slate-600 hover:bg-white transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                {saving ? "Đang xử lý..." : modal === "add" ? "Đăng đơn du học" : "Cập nhật đơn du học"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Đơn du học này sẽ bị xóa vĩnh viễn khỏi hệ thống."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
