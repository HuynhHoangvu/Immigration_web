import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Briefcase,
} from "lucide-react";
import { employerApi, categoriesApi, getImageUrl } from "@/core/services/api";
import {
  getCountryLabels,
  getCountriesList,
  getJobTypeLabel,
  JOBTYPE_LABELS,
} from "@/core/utils/helpers";
import toast from "react-hot-toast";
import type { Job, Category } from "@/core/types";

const PRESET_COUNTRIES = getCountriesList();
const BLANK = {
  title: "",
  description: "",
  requirements: "",
  benefits: "",
  company: "",
  location: "",
  country: "australia",
  countryCustom: "",
  jobType: "full_time",
  status: "active",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "AUD",
  slots: "",
  deadline: "",
  image: "",
  categoryId: "",
};

// Huy hiệu trạng thái với màu sắc tương phản tốt trên cả 2 nền
const STATUS_BADGE: Record<string, string> = {
  active:
    "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20",
  draft:
    "text-amber-600 bg-amber-50 border-amber-200 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20",
  paused:
    "text-slate-500 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-gray-400/10 dark:border-gray-400/20",
  closed:
    "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
};

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState("");
  const fileRef = useRef<File | null>(null);

  const load = () => {
    setLoading(true);
    employerApi
      .getMyJobs()
      .then((r) => setJobs(r.data.data || []))
      .catch(() => toast.error("Không thể tải danh sách tin"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    categoriesApi.getAll().then((r) => setCategories(r.data || []));
  }, []);

  const openCreate = () => {
    setEditing(null);
    const lastCurrency = localStorage.getItem("lastSalaryCurrency") || "AUD";
    setForm({ ...BLANK, salaryCurrency: lastCurrency });
    setPreview("");
    fileRef.current = null;
    setModal(true);
  };

  const openEdit = (job: Job) => {
    setEditing(job);
    const isPreset = PRESET_COUNTRIES.some((c) => c.value === job.country);
    setForm({
      ...BLANK,
      title: job.title || "",
      description: job.description || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      company: job.company || "",
      location: job.location || "",
      country: isPreset ? job.country : "__other__",
      countryCustom: isPreset ? "" : job.country,
      jobType: job.jobType || "full_time",
      status: job.status || "active",
      salaryMin: String(job.salaryMin || ""),
      salaryMax: String(job.salaryMax || ""),
      salaryCurrency: job.salaryCurrency || "AUD",
      slots: String(job.slots || ""),
      deadline: job.deadline || "",
      image: job.image || "",
      categoryId: job.categoryId || "",
    });
    setPreview(job.image ? getImageUrl(job.image) : "");
    fileRef.current = null;
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.country) {
      toast.error("Vui lòng điền Tiêu đề, Mô tả và Quốc gia");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      const country =
        form.country === "__other__" ? form.countryCustom.trim() : form.country;
      const fields: Record<string, string> = {
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        company: form.company,
        location: form.location,
        country,
        jobType: form.jobType,
        status: form.status,
        salaryMin: form.salaryMin,
        salaryMax: form.salaryMax,
        salaryCurrency: form.salaryCurrency,
        slots: form.slots,
        deadline: form.deadline,
        categoryId: form.categoryId,
      };
      if (!fileRef.current && form.image) fields.image = form.image;
      Object.entries(fields).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (fileRef.current) fd.append("image", fileRef.current);

      if (editing) {
        await employerApi.updateJob(editing.id, fd);
        toast.success("Đã cập nhật!");
      } else {
        await employerApi.createJob(fd);
        toast.success("Đã đăng tin!");
      }
      setModal(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await employerApi.deleteJob(deleteId);
      toast.success("Đã xóa tin");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const f =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    localStorage.setItem("lastSalaryCurrency", currency);
    setForm((prev) => ({ ...prev, salaryCurrency: currency }));
  };

  // Class dùng chung để đồng bộ giao diện
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-colors";
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold focus:ring-1 focus:ring-amber-400 dark:focus:ring-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tin tuyển dụng của tôi
          </h1>
          <p className="text-slate-500 dark:text-gray-300 text-sm">
            {jobs.length} tin đăng đang được quản lý
          </p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Đăng tin mới
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-brand-card rounded-2xl animate-pulse border border-slate-200 dark:border-brand-border"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className={`${cardClasses} p-16 text-center`}>
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase
              size={32}
              className="text-slate-300 dark:text-gray-300"
            />
          </div>
          <p className="text-slate-900 dark:text-white font-bold text-lg mb-1">
            Chưa có tin tuyển dụng nào
          </p>
          <p className="text-slate-500 dark:text-gray-300 text-sm mb-6 max-w-xs mx-auto">
            Bắt đầu tìm kiếm ứng viên tiềm năng bằng cách tạo tin tuyển dụng đầu
            tiên của bạn.
          </p>
          <button
            onClick={openCreate}
            className="btn-primary text-sm px-6 py-2.5 font-medium"
          >
            Đăng tin ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`${cardClasses} p-4 flex items-center gap-4 group hover:border-amber-400/50 transition-all`}
            >
              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 overflow-hidden border border-slate-100 dark:border-white/5">
                {job.image ? (
                  <img
                    src={getImageUrl(job.image)}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-300">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-slate-900 dark:text-white font-bold truncate text-sm sm:text-base">
                    {job.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${STATUS_BADGE[job.status] || ""}`}
                  >
                    {job.status === "active" ? "Đang tuyển" : job.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-300 text-xs font-medium">
                  <span>{getCountryLabels()[job.country]}</span>
                  <span>•</span>
                  <span>{job.slots || 0} chỉ tiêu</span>
                  <span>•</span>
                  <span>{getJobTypeLabel(job.jobType)}</span>
                </div>
                <p className="text-slate-400 dark:text-gray-300 text-xs mt-1">
                  Lượt xem:{" "}
                  <span className="text-slate-600 dark:text-white font-bold">
                    {job.viewCount || 0}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => openEdit(job)}
                  className="p-2.5 text-slate-400 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 rounded-xl transition-all"
                  title="Chỉnh sửa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(job.id)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-2xl my-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                {editing
                  ? "Chỉnh sửa tin tuyển dụng"
                  : "Đăng tin tuyển dụng mới"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Vị trí & Công ty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Tiêu đề tuyển dụng *
                  </label>
                  <input
                    value={form.title}
                    onChange={f("title")}
                    className={`${inputClasses} h-12`}
                    placeholder="VD: Công nhân hái trái cây tại Úc"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Tên doanh nghiệp
                  </label>
                  <input
                    value={form.company}
                    onChange={f("company")}
                    className={`${inputClasses} h-12`}
                    placeholder="Tên công ty"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Địa điểm cụ thể
                  </label>
                  <input
                    value={form.location}
                    onChange={f("location")}
                    className={`${inputClasses} h-12`}
                    placeholder="Thành phố / Bang"
                  />
                </div>
              </div>

              {/* Quốc gia & Loại hình */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Quốc gia *
                  </label>
                  <select
                    value={form.country}
                    onChange={f("country")}
                    className={`${inputClasses} h-12 appearance-none`}
                  >
                    {PRESET_COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                    <option value="__other__">Khác...</option>
                  </select>
                  {form.country === "__other__" && (
                    <input
                      value={form.countryCustom}
                      onChange={f("countryCustom")}
                      className={`${inputClasses} h-12 mt-2`}
                      placeholder="Nhập tên quốc gia"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Loại hình
                  </label>
                  <select
                    value={form.jobType}
                    onChange={f("jobType")}
                    className={`${inputClasses} h-12 appearance-none`}
                  >
                    {Object.entries(JOBTYPE_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lương & Tiền tệ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Lương tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={f("salaryMin")}
                    className={`${inputClasses} h-12`}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Lương tối đa
                  </label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={f("salaryMax")}
                    className={`${inputClasses} h-12`}
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Tiền tệ
                  </label>
                  <select
                    value={form.salaryCurrency}
                    onChange={handleCurrencyChange}
                    className={`${inputClasses} h-12 appearance-none`}
                  >
                    <option value="AUD">🇦🇺 AUD (Úc)</option>
                    <option value="CAD">🇨🇦 CAD (Canada)</option>
                    <option value="NZD">🇳🇿 NZD (New Zealand)</option>
                    <option value="VND">🇻🇳 VND (Việt Nam)</option>
                    <option value="USD">🇺🇸 USD (Mỹ)</option>
                    <option value="JPY">🇯🇵 JPY (Nhật)</option>
                    <option value="KRW">🇰🇷 KRW (Hàn)</option>
                    <option value="EUR">🇪🇺 EUR (Châu Âu)</option>
                  </select>
                </div>
              </div>

              {/* Chỉ tiêu & Hạn nộp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Chỉ tiêu
                  </label>
                  <input
                    type="number"
                    value={form.slots}
                    onChange={f("slots")}
                    className={`${inputClasses} h-12`}
                    placeholder="Số lượng"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Hạn nộp
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={f("deadline")}
                    className={`${inputClasses} h-12`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Trạng thái
                  </label>
                  <select
                    value={form.status}
                    onChange={f("status")}
                    className={`${inputClasses} h-12 appearance-none font-bold`}
                  >
                    <option value="active" className="text-green-600 font-bold">
                      Đang tuyển
                    </option>
                    <option value="draft" className="text-slate-500 font-bold">
                      Bản nháp
                    </option>
                    <option value="paused" className="text-amber-600 font-bold">
                      Tạm dừng
                    </option>
                    <option value="closed" className="text-red-600 font-bold">
                      Đã đóng
                    </option>
                  </select>
                </div>
              </div>

              {/* Ngành nghề & Ảnh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Ngành nghề
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={f("categoryId")}
                    className={`${inputClasses} h-12 appearance-none`}
                  >
                    <option value="">— Chọn ngành —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Ảnh bìa
                  </label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 h-12 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-amber-600 hover:border-amber-400 cursor-pointer transition-all">
                      <ImageIcon size={16} /> {preview ? "Thay đổi" : "Tải lên"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          fileRef.current = file;
                          const reader = new FileReader();
                          reader.onload = (ev) =>
                            setPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {(preview || form.image) && (
                      <div className="w-12 h-12 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={preview || getImageUrl(form.image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Văn bản dài */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Mô tả công việc *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={f("description")}
                    className={`${inputClasses} h-32 py-3 resize-none`}
                    placeholder="Mô tả nhiệm vụ chính..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Yêu cầu ứng viên
                  </label>
                  <textarea
                    value={form.requirements}
                    onChange={f("requirements")}
                    className={`${inputClasses} h-24 py-3 resize-none`}
                    placeholder="Kỹ năng, kinh nghiệm..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-gray-300 mb-2 block uppercase tracking-wider">
                    Quyền lợi
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={f("benefits")}
                    className={`${inputClasses} h-24 py-3 resize-none`}
                    placeholder="Lương thưởng, bảo hiểm, hỗ trợ..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-white/5">
              <button
                onClick={() => setModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-primary py-3 font-bold shadow-lg shadow-amber-500/20"
              >
                {saving
                  ? "Đang xử lý..."
                  : editing
                    ? "Lưu thay đổi"
                    : "Đăng tin ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={32} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-2">
              Xóa tin tuyển dụng?
            </h3>
            <p className="text-slate-500 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              Dữ liệu tin tuyển dụng và hồ sơ ứng viên liên quan sẽ bị xóa vĩnh
              viễn khỏi hệ thống.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
