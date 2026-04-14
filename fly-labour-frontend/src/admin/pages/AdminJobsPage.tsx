import { useState, useRef, useEffect } from "react";
import ConfirmDeleteModal from "@/admin/components/ConfirmDeleteModal";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
  Image as ImageIcon,
  Clock,
  Briefcase,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react";
import type { Category, Job } from "@/core/types";
import {
  getCountryLabels,
  JOBTYPE_LABELS,
  formatSalary,
  formatDate,
} from "@/core/utils/helpers";
import toast from "react-hot-toast";
import { categoriesApi, jobsApi, getImageUrl } from "@/core/services/api";

const STATUS_COLORS = {
  active: "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-400/10 dark:border-green-400/20",
  paused: "text-amber-600 bg-amber-50 border-amber-200 dark:text-yellow-400 dark:bg-yellow-400/10 dark:border-yellow-400/20",
  closed: "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
  draft: "text-slate-500 bg-slate-100 border-slate-200 dark:text-gray-400 dark:bg-gray-400/10 dark:border-gray-400/20",
  pending_review: "text-orange-600 bg-orange-50 border-orange-200 dark:text-amber-400 dark:bg-orange-400/10 dark:border-amber-400/20",
};

const STATUS_LABELS = {
  active: "Hoạt động",
  paused: "Tạm dừng",
  closed: "Đã đóng",
  draft: "Nháp",
  pending_review: "Chờ duyệt",
};

const PRESET_COUNTRIES = [
  { value: "australia", label: "🇦🇺 Úc (Australia)" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "new_zealand", label: "🇳🇿 New Zealand" },
  { value: "uk", label: "🇬🇧 Anh Quốc (UK)" },
  { value: "germany", label: "🇩🇪 Đức (Germany)" },
  { value: "japan", label: "🇯🇵 Nhật Bản (Japan)" },
  { value: "norway", label: "🇳🇴 Na Uy (Norway)" },
  { value: "portugal", label: "🇵🇹 Bồ Đào Nha (Portugal)" },
  { value: "czech", label: "🇨🇿 Séc (Czech Republic)" },
  { value: "us", label: "🇺🇸 Mỹ (USA)" },
  { value: "singapore", label: "🇸🇬 Singapore" },
  { value: "south_korea", label: "🇰🇷 Hàn Quốc (Korea)" },
  { value: "taiwan", label: "🇹🇼 Đài Loan (Taiwan)" },
  { value: "uae", label: "🇦🇪 UAE" },
  { value: "__other__", label: "✏️ Khác (nhập tay)..." },
];

type FormData = {
  title: string;
  company: string;
  location: string;
  country: string;
  countryCustom: string;
  jobType: string;
  status: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  slots: string;
  deadline: string;
  isHot: boolean;
  isFeatured: boolean;
  categoryId: string;
  description: string;
  requirements: string;
  benefits: string;
  imagePreview: string;
  // Structured data fields
  req_age?: string;
  req_workTime?: string;
  req_experience?: string;
  req_language?: string;
  req_other?: string;
  req_checklist?: string[];
  ben_departure?: string;
  ben_checklist?: string[];
};

const EMPTY_FORM: FormData = {
  title: "",
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
  isHot: false,
  isFeatured: false,
  categoryId: "",
  description: "",
  requirements: "",
  benefits: "",
  imagePreview: "",
  req_age: "",
  req_workTime: "",
  req_experience: "",
  req_language: "",
  req_other: "",
  req_checklist: [],
  ben_departure: "",
  ben_checklist: [],
};

const SUGGESTED_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75",
  "2": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=75",
  "3": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=75",
  "4": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=75",
  "5": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75",
  "6": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=75",
  "7": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=75",
  "8": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=75",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<"hourly" | "weekly" | "monthly" | "yearly">("monthly");
  const [tableSalaryPeriod, setTableSalaryPeriod] = useState<"hourly" | "weekly" | "monthly" | "yearly">("monthly");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObjRef = useRef<File | null>(null);
  
  const [reqPresets, setReqPresets] = useState<string[]>([]);
  const [benPresets, setBenPresets] = useState<string[]>([]);

  useEffect(() => {
    const savedReq = localStorage.getItem("job_req_presets");
    setReqPresets(savedReq ? JSON.parse(savedReq) : ["Hồ sơ cá nhân", "Lý lịch tư pháp", "Hình ảnh/Video", "Bằng cấp/Chứng chỉ"]);
    const savedBen = localStorage.getItem("job_ben_presets");
    setBenPresets(savedBen ? JSON.parse(savedBen) : ["Bảo lãnh gia đình", "Nghỉ phép có lương", "Phụ cấp ăn uống", "Hỗ trợ nơi ở"]);
  }, []);

  const updateReqPresets = (list: string[]) => { setReqPresets(list); localStorage.setItem("job_req_presets", JSON.stringify(list)); };
  const updateBenPresets = (list: string[]) => { setBenPresets(list); localStorage.setItem("job_ben_presets", JSON.stringify(list)); };

  const pendingJobs = jobs.filter((j) => j.status === "pending_review");
  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getSalaryEstimates = (value: number, period: string) => {
    let monthly: number;
    switch (period) {
      case "hourly": monthly = (value * 40 * 52) / 12; break;
      case "weekly": monthly = (value * 52) / 12; break;
      case "yearly": monthly = value / 12; break;
      default: monthly = value;
    }
    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0);
    return {
      hourly: fmt(monthly / ((40 * 52) / 12)),
      weekly: fmt((monthly * 12) / 52),
      monthly: fmt(monthly),
      yearly: fmt(monthly * 12),
    };
  };

  const openAdd = () => {
    const lastCurrency = localStorage.getItem("lastSalaryCurrency") || "AUD";
    setForm({ ...EMPTY_FORM, salaryCurrency: lastCurrency });
    setEditing(null);
    setUrlInput("");
    fileObjRef.current = null;
    setSalaryPeriod("monthly");
    setModal("add");
  };

  const openEdit = (job: Job) => {
    const isPreset = PRESET_COUNTRIES.some((c) => c.value === job.country && c.value !== "__other__");
    setForm({
      ...EMPTY_FORM,
      title: job.title,
      company: job.company || "",
      location: job.location || "",
      country: isPreset ? job.country : "__other__",
      countryCustom: isPreset ? "" : job.country || "",
      jobType: job.jobType,
      status: job.status,
      salaryMin: job.salaryMin?.toString() || "",
      salaryMax: job.salaryMax?.toString() || "",
      salaryCurrency: job.salaryCurrency || "AUD",
      slots: job.slots?.toString() || "",
      deadline: job.deadline?.slice(0, 10) || "",
      isHot: job.isHot,
      isFeatured: job.isFeatured,
      categoryId: job.categoryId || "",
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      imagePreview: job.image || "",
    });

    // Parse structured data if exists
    try {
      if (job.requirements?.startsWith('{"v2":')) {
        const parsed = JSON.parse(job.requirements);
        setForm(f => ({
          ...f,
          req_age: parsed.v2.age || "",
          req_workTime: parsed.v2.workTime || "",
          req_experience: parsed.v2.experience || "",
          req_language: parsed.v2.language || "",
          req_other: parsed.v2.other || "",
          req_checklist: parsed.v2.checklist || [],
          req_transport: parsed.v2.transport || "",
          requirements: parsed.v2.raw || ""
        }));
      }
      if (job.benefits?.startsWith('{"v2":')) {
        const parsed = JSON.parse(job.benefits);
        setForm(f => ({
          ...f,
          ben_departure: parsed.v2.departure || "",
          ben_checklist: parsed.v2.checklist || [],
          benefits: parsed.v2.raw || ""
        }));
      }
    } catch { /* ignore if not JSON */ }

    setUrlInput(job.image || "");
    fileObjRef.current = null;
    setEditing(job);
    setModal("edit");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Ảnh tối đa 10MB"); return; }
    fileObjRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const applyUrlInput = () => {
    if (!urlInput.trim()) return;
    setForm((f) => ({ ...f, imagePreview: urlInput.trim() }));
    toast.success("Đã áp dụng URL ảnh");
  };

  const useSuggestedImage = (catId: string) => {
    const url = SUGGESTED_IMAGES[catId];
    if (url) {
      setForm((f) => ({ ...f, imagePreview: url }));
      setUrlInput(url);
    }
  };

  const loadJobs = () => {
    setLoading(true);
    jobsApi.getAllAdmin({ search, limit: 50 })
      .then((r) => { setJobs(r.data.data); setTotal(r.data.meta.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoriesApi.getAllAdmin().then((r) => setCats(r.data)).catch(() => {});
    loadJobs();
  }, [search]);

  const handleSave = async () => {
    if (!form.title) { toast.error("Vui lòng nhập tiêu đề"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const skipKeys = [
        "imagePreview",
        "countryCustom",
        "req_age",
        "req_workTime",
        "req_experience",
        "req_language",
        "req_other",
        "req_checklist",
        "req_transport",
        "ben_departure",
        "ben_checklist"
      ];
      Object.entries(form).forEach(([k, v]) => {
        if (skipKeys.includes(k)) return;
        if (v === "" || v === undefined || v === null) return;
        fd.append(k, String(v));
      });
      if (form.country === "__other__") {
        if (!form.countryCustom.trim()) { toast.error("Vui lòng nhập tên quốc gia"); setSaving(false); return; }
        fd.set("country", form.countryCustom.trim());
      }

      // Serialize structured requirements
      if (form.req_age || form.req_experience || form.req_checklist?.length) {
        const structReq = {
          v2: {
            age: form.req_age,
            workTime: form.req_workTime,
            experience: form.req_experience,
            language: form.req_language,
            other: form.req_other,
            checklist: form.req_checklist,
            raw: form.requirements
          }
        };
        fd.set("requirements", JSON.stringify(structReq));
      }

      // Serialize structured benefits
      if (form.ben_departure || form.ben_checklist?.length) {
        const structBen = {
          v2: {
            departure: form.ben_departure,
            checklist: form.ben_checklist,
            raw: form.benefits
          }
        };
        fd.set("benefits", JSON.stringify(structBen));
      }

      if (imgTab === "upload" && fileObjRef.current) fd.append("image", fileObjRef.current);
      else if (imgTab === "url" && urlInput.trim()) fd.set("image", urlInput.trim());

      if (!form.categoryId || form.categoryId.length < 10) fd.delete("categoryId");

      if (modal === "edit" && editing) {
        await jobsApi.update(editing.id, fd);
        toast.success("Đã cập nhật bài đăng");
      } else {
        await jobsApi.create(fd);
        toast.success("Đã thêm bài đăng mới");
      }
      setModal(null);
      loadJobs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi lưu bài đăng");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.remove(id);
      toast.success("Đã xóa bài đăng");
      setDeleting(null);
      loadJobs();
    } catch { toast.error("Xóa thất bại"); }
  };

  const handleApprove = async (id: string) => {
    try {
      await jobsApi.approveJob(id);
      toast.success("Đã duyệt bài đăng");
      loadJobs();
    } catch { toast.error("Duyệt thất bại"); }
  };

  const handleReject = async (id: string) => {
    try {
      await jobsApi.rejectJob(id);
      toast.success("Đã từ chối bài đăng");
      loadJobs();
    } catch { toast.error("Từ chối thất bại"); }
  };

  const setField = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    localStorage.setItem("lastSalaryCurrency", currency);
    setForm((f) => ({ ...f, salaryCurrency: currency }));
  };

  // UI Helpers
  const cardClasses = "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm transition-colors";
  const inputClasses = "w-full text-sm rounded-xl px-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-black focus:border-amber-400 dark:focus:border-brand-gold outline-none transition-all";

  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header Area */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Quản lý Việc làm
            {pendingJobs.length > 0 && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-400/30 font-black uppercase tracking-widest animate-pulse">
                {pendingJobs.length} đơn chờ duyệt
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-brand-muted text-sm mt-1">Tổng cộng {total} tin tuyển dụng trên hệ thống</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20">
          <Plus size={18} /> Đăng bài mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Tất cả", count: jobs.length },
          { value: "pending_review", label: "⌛ Chờ duyệt", count: pendingJobs.length },
          { value: "active", label: "✅ Hoạt động", count: jobs.filter(j => j.status === 'active').length },
          { value: "paused", label: "⏸ Tạm dừng", count: jobs.filter(j => j.status === 'paused').length },
          { value: "closed", label: "❌ Đã đóng", count: jobs.filter(j => j.status === 'closed').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              statusFilter === tab.value
                ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-500 dark:text-brand-muted hover:border-amber-400"
            }`}
          >
            {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Toolbar Area */}
      <div className={`${cardClasses} p-4 flex flex-wrap gap-4 items-center`}>
        <div className="relative flex-1 min-w-[280px] max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClasses}
            placeholder="Tìm theo tên công việc, công ty..."
          />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đổi đơn vị lương:</span>
          <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
            {(["hourly", "weekly", "monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setTableSalaryPeriod(p)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  tableSalaryPeriod === p ? "bg-white dark:bg-brand-gold shadow-sm text-amber-700 dark:text-amber-900" : "text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {{ hourly: "Giờ", weekly: "Tuần", monthly: "Tháng", yearly: "Năm" }[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={`${cardClasses} overflow-hidden`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest">
                <th className="text-left px-5 py-4 w-16 text-center">Ảnh</th>
                <th className="text-left px-5 py-4">Công việc</th>
                <th className="text-left px-5 py-4 hidden sm:table-cell">Quốc gia</th>
                <th className="text-left px-5 py-4 hidden md:table-cell">Lương ({tableSalaryPeriod})</th>
                <th className="text-left px-5 py-4 hidden lg:table-cell">Nguồn</th>
                <th className="text-left px-5 py-4">Trạng thái</th>
                <th className="text-right px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                [...Array(6)].map((_, i) => <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-12 bg-slate-50 dark:bg-white/5 rounded-xl animate-pulse" /></td></tr>)
              ) : filtered.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-brand-dark border border-slate-200 dark:border-white/5 flex-shrink-0 shadow-sm">
                      {job.image ? (
                        <img src={getImageUrl(job.image)} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-brand-muted"><ImageIcon size={18} /></div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">{job.title}</p>
                      <p className="text-slate-500 dark:text-brand-muted text-[11px] font-medium">{job.company}</p>
                      <div className="flex gap-1.5 mt-1">
                        {job.isHot && <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm shadow-red-500/20">Hot</span>}
                        {job.isFeatured && <span className="bg-amber-100 dark:bg-brand-gold/20 text-amber-700 dark:text-brand-gold text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200 dark:border-brand-gold/30 uppercase">Nổi bật</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="badge-country border-slate-200 dark:border-transparent text-[10px]">{getCountryLabels()[job.country]}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-amber-700 dark:text-brand-gold font-bold text-xs">
                      {job.salaryMin || job.salaryMax ? (() => {
                        const cur = job.salaryCurrency || "";
                        if (tableSalaryPeriod === "monthly") return formatSalary(job.salaryMin, job.salaryMax, cur);
                        const minE = job.salaryMin ? getSalaryEstimates(job.salaryMin, "monthly")[tableSalaryPeriod] : null;
                        const maxE = job.salaryMax ? getSalaryEstimates(job.salaryMax, "monthly")[tableSalaryPeriod] : null;
                        return [minE, maxE].filter(Boolean).join(" – ") + " " + cur;
                      })() : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-slate-700 dark:text-gray-300 text-[11px] font-bold truncate max-w-[140px]">{job.createdBy?.companyName || job.createdBy?.fullName || "Hệ thống"}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${job.createdBy ? "text-blue-500" : "text-amber-500"}`}>{job.createdBy ? "Đối tác" : "Nội bộ"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${STATUS_COLORS[job.status] || ""}`}>
                      {STATUS_LABELS[job.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === "pending_review" && (
                        <>
                          <button onClick={() => handleApprove(job.id)} title="Duyệt bài" className="p-2 rounded-xl bg-green-50 dark:bg-green-400/10 text-green-600 hover:bg-green-100 transition-all"><CheckCircle size={16} /></button>
                          <button onClick={() => handleReject(job.id)} title="Từ chối" className="p-2 rounded-xl bg-red-50 dark:bg-red-400/10 text-red-600 hover:bg-red-100 transition-all"><XCircle size={16} /></button>
                        </>
                      )}
                      <button onClick={() => openEdit(job)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold transition-all"><Pencil size={16} /></button>
                      <button onClick={() => setDeleting(job.id)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ Add/Edit Modal ══ */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0">
              <h2 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Briefcase className="text-amber-600" />
                {modal === "add" ? "Đăng bài mới" : "Chỉnh sửa bài đăng"}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* 1. Hình ảnh & Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-100 dark:border-white/5">
                <div className="md:col-span-4 space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Hình đại diện *
                  </label>
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/40 group">
                    {form.imagePreview ? (
                      <img src={getImageUrl(form.imagePreview)} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-brand-muted gap-2">
                        <ImageIcon size={30} className="opacity-20" />
                        <p className="text-[10px] font-medium">Chưa có ảnh</p>
                      </div>
                    )}
                    {form.imagePreview && (
                      <button onClick={() => { setForm((f) => ({ ...f, imagePreview: "" })); setUrlInput(""); fileObjRef.current = null; }}
                              className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-xl shadow-lg transition-all"><Trash2 size={14} /></button>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setImgTab("upload")} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition-all ${imgTab === "upload" ? "bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 border-transparent shadow-sm" : "bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5"}`}>TẢI LÊN</button>
                    <button onClick={() => setImgTab("url")} className={`flex-1 py-1.5 text-[9px] font-black rounded-lg border transition-all ${imgTab === "url" ? "bg-slate-900 dark:bg-brand-gold text-white dark:text-amber-900 border-transparent shadow-sm" : "bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/5"}`}>LINK URL</button>
                  </div>
                  {imgTab === "upload" ? (
                    <label className="w-full border-2 border-dashed border-slate-100 dark:border-white/5 hover:border-amber-400 rounded-xl py-2 flex flex-col items-center gap-1 text-slate-400 hover:text-amber-600 transition-all cursor-pointer">
                      <Upload size={14} /> <span className="text-[9px] font-bold">CHỌN TỆP</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  ) : (
                    <input value={urlInput} onChange={(e) => { setUrlInput(e.target.value); if (e.target.value.includes(".")) setForm(f => ({ ...f, imagePreview: e.target.value })); }} className={`${inputClasses} h-8 text-[10px]`} placeholder="Paste URL..." />
                  )}
                </div>

                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiêu đề bài tuyển dụng *</label>
                    <input value={form.title} onChange={setField("title")} className={`${inputClasses} h-11 text-base font-bold`} placeholder="VD: Nam nhân viên kho lạnh tại Úc" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngành nghề</label>
                      <select value={form.categoryId} onChange={e => { setField("categoryId")(e); if (!form.imagePreview) useSuggestedImage(e.target.value); }} className={`${inputClasses} h-11 appearance-none`}>
                        <option value="">-- Chọn ngành --</option>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại hình</label>
                      <select value={form.jobType} onChange={setField("jobType")} className={`${inputClasses} h-11 appearance-none`}>
                        {Object.entries(JOBTYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên doanh nghiệp</label>
                      <input value={form.company} onChange={setField("company")} className={`${inputClasses} h-11`} placeholder="VD: Harvest Australia Ltd" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa điểm cụ thể</label>
                      <input value={form.location} onChange={setField("location")} className={`${inputClasses} h-11`} placeholder="VD: Brisbane, QLD" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Chi tiết & Hậu cần */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quốc gia *</label>
                    <select value={form.country} onChange={setField("country")} className={`${inputClasses} h-11 appearance-none`}>
                      {PRESET_COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chỉ tiêu (Slot)</label>
                    <input type="number" value={form.slots} onChange={setField("slots")} className={`${inputClasses} h-11`} placeholder="Số lượng" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hạn nộp</label>
                    <input type="date" value={form.deadline} onChange={setField("deadline")} className={`${inputClasses} h-11 appearance-none`} />
                  </div>
                </div>
                {form.country === "__other__" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên quốc gia khác</label>
                    <input value={form.countryCustom} onChange={e => setForm(f => ({ ...f, countryCustom: e.target.value }))} className={`${inputClasses} h-11`} placeholder="Nhập tên quốc gia..." />
                  </div>
                )}
              </div>

              {/* 3. Lương & Trạng thái */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">
                  <DollarSign size={14} /> Tài chính & Trạng thái
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                  <div className="md:col-span-8 p-4 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-2xl">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">MIN</label>
                        <input type="number" value={form.salaryMin} onChange={setField("salaryMin")} className={`${inputClasses} h-10`} placeholder="3000" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">MAX</label>
                        <input type="number" value={form.salaryMax} onChange={setField("salaryMax")} className={`${inputClasses} h-10`} placeholder="4500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400">TIỀN TỆ</label>
                        <select value={form.salaryCurrency} onChange={handleCurrencyChange} className={`${inputClasses} h-10 appearance-none`}>
                          <option value="AUD">🇦🇺 AUD</option>
                          <option value="CAD">🇨🇦 CAD</option>
                          <option value="VND">🇻🇳 VND</option>
                          <option value="USD">🇺🇸 USD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái tin</label>
                    <select value={form.status} onChange={setField("status")} className={`${inputClasses} h-11 appearance-none font-bold`}>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-6 items-center bg-slate-50 dark:bg-black/20 px-4 py-3 rounded-2xl border border-slate-100 dark:border-white/5">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phân loại:</span>
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={form.isHot} onChange={e => setForm(f => ({ ...f, isHot: e.target.checked }))} className="w-5 h-5 accent-red-500 rounded-lg shadow-sm" />
                      <span className="text-xs font-bold text-slate-600 dark:text-gray-300 group-hover:text-red-500 transition-colors">🔥 TIN HOT</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-5 h-5 accent-amber-500 rounded-lg shadow-sm" />
                      <span className="text-xs font-bold text-slate-600 dark:text-gray-300 group-hover:text-amber-500 transition-colors">⭐ NỔI BẬT</span>
                    </label>
                </div>
              </div>

              {/* 4. Yêu cầu & Quyền lợi (Dạng bảng) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">
                  <TrendingUp size={14} /> Cấu hình hiển thị dạng bảng
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yêu cầu */}
                  <div className="p-5 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-2xl space-y-4">
                    <h3 className="text-blue-700 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest">1. YÊU CẦU CÔNG VIỆC</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Độ tuổi</label>
                          <input value={form.req_age} onChange={e => setForm({...form, req_age: e.target.value})} className={`${inputClasses} h-9`} placeholder="18 - 40" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Làm việc</label>
                          <input value={form.req_workTime} onChange={e => setForm({...form, req_workTime: e.target.value})} className={`${inputClasses} h-9`} placeholder="40h/tuần" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Kinh nghiệm</label>
                        <input value={form.req_experience} onChange={e => setForm({...form, req_experience: e.target.value})} className={`${inputClasses} h-9`} placeholder="VD: 2 năm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Ngoại ngữ</label>
                        <input value={form.req_language} onChange={e => setForm({...form, req_language: e.target.value})} className={`${inputClasses} h-9`} placeholder="PTE/IELTS" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Yêu cầu khác</label>
                        <textarea value={form.req_other} onChange={e => setForm({...form, req_other: e.target.value})} className={`${inputClasses} h-16 py-2 resize-none text-[11px]`} placeholder="VD: Sức khỏe tốt, không tiền án..." />
                      </div>
                      <div className="pt-2 border-t border-blue-200/30">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Checklist Hồ sơ</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {form.req_checklist?.map(item => (
                             <div key={item} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-lg text-[10px] font-bold border border-blue-200 dark:border-blue-500/30 hover:border-red-400 group transition-all">
                                <span>{item}</span>
                                <button type="button" onClick={() => setForm({...form, req_checklist: form.req_checklist?.filter(i => i !== item)})} className="opacity-40 group-hover:opacity-100 hover:text-red-500">
                                   <X size={12} />
                                </button>
                             </div>
                          ))}
                        </div>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Nhập yêu cầu khác & Enter..." 
                            className={`${inputClasses} h-9 pl-3 pr-10 text-[11px]`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (val && !form.req_checklist?.includes(val)) {
                                  setForm({...form, req_checklist: [...(form.req_checklist || []), val]});
                                  if (!reqPresets.includes(val)) updateReqPresets([...reqPresets, val]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <Plus size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 opacity-50" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-slate-400">
                           {reqPresets.map(p => (
                             <div key={p} className="flex items-center gap-1 text-[9px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-transparent hover:border-blue-400 group transition-all">
                               <button type="button" onClick={() => setForm({...form, req_checklist: [...(form.req_checklist || []), p].filter((v, i, a) => a.indexOf(v) === i)})} className="hover:text-blue-600 dark:hover:text-blue-400">+ {p}</button>
                               <button type="button" onClick={() => updateReqPresets(reqPresets.filter(i => i !== p))} className="hidden group-hover:flex ml-1 text-red-500 font-bold px-1 hover:bg-red-50 rounded">×</button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quyền lợi */}
                  <div className="p-5 bg-green-50/50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 rounded-2xl space-y-4">
                    <h3 className="text-green-700 dark:text-green-400 font-black text-[10px] uppercase tracking-widest">2. QUYỀN LỢI ĐÃI NGỘ</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Thời gian xuất cảnh</label>
                        <input value={form.ben_departure} onChange={e => setForm({...form, ben_departure: e.target.value})} className={`${inputClasses} h-9`} placeholder="4-6 tháng" />
                      </div>
                      <div className="pt-2 border-t border-green-200/30">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Checklist Quyền lợi</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {form.ben_checklist?.map(item => (
                             <div key={item} className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-lg text-[10px] font-bold border border-green-200 dark:border-green-500/30 hover:border-red-400 group transition-all">
                                <span>{item}</span>
                                <button type="button" onClick={() => setForm({...form, ben_checklist: form.ben_checklist?.filter(i => i !== item)})} className="opacity-40 group-hover:opacity-100 hover:text-red-500">
                                   <X size={12} />
                                </button>
                             </div>
                          ))}
                        </div>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Nhập quyền lợi khác & Enter..." 
                            className={`${inputClasses} h-9 pl-3 pr-10 text-[11px]`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const val = e.currentTarget.value.trim();
                                if (val && !form.ben_checklist?.includes(val)) {
                                  setForm({...form, ben_checklist: [...(form.ben_checklist || []), val]});
                                  if (!benPresets.includes(val)) updateBenPresets([...benPresets, val]);
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                          />
                          <Plus size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 opacity-50" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-slate-400">
                           {benPresets.map(p => (
                             <div key={p} className="flex items-center gap-1 text-[9px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-lg border border-transparent hover:border-green-400 group transition-all">
                               <button type="button" onClick={() => setForm({...form, ben_checklist: [...(form.ben_checklist || []), p].filter((v, i, a) => a.indexOf(v) === i)})} className="hover:text-green-600 dark:hover:text-green-400">+ {p}</button>
                               <button type="button" onClick={() => updateBenPresets(benPresets.filter(i => i !== p))} className="hidden group-hover:flex ml-1 text-red-500 font-bold px-1 hover:bg-red-50 rounded">×</button>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Nội dung chi tiết */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-2">
                  <FileText size={14} /> Mô tả công việc
                </div>
                <div className="space-y-1.5">
                  <textarea value={form.description} onChange={setField("description")} className={`${inputClasses} h-64 py-4 resize-none text-base leading-relaxed`} placeholder="Mô tả các nhiệm vụ chính, môi trường làm việc..." />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 h-12 rounded-2xl font-bold border border-slate-200 dark:border-brand-border text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/5 transition-all">Hủy bỏ</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50">
                {saving ? "Đang xử lý..." : modal === "add" ? "Đăng bài tuyển dụng" : "Cập nhật bài viết"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmDeleteModal
          message="Hành động này sẽ xóa vĩnh viễn tin tuyển dụng và toàn bộ hồ sơ ứng tuyển liên quan."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}