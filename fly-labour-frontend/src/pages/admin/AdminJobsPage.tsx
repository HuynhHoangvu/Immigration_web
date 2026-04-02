import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import type { Category, Job } from "@/types";
import {
  getCountryLabels,
  JOBTYPE_LABELS,
  formatSalary,
  formatDate,
} from "@/utils/helpers";
import toast from "react-hot-toast";
import { categoriesApi, jobsApi, getImageUrl } from "@/services/api";

const STATUS_COLORS = {
  active: "text-green-400 bg-green-400/10 border-green-400/20",
  paused: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  closed: "text-red-400 bg-red-400/10 border-red-400/20",
  draft:
    "text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-400/10 border-gray-300 dark:border-gray-400/20",
  pending_review: "text-amber-400 bg-orange-400/10 border-amber-400/20",
};
const STATUS_LABELS = {
  active: "Hoạt động",
  paused: "Tạm dừng",
  closed: "Đã đóng",
  draft: "Nháp",
  pending_review: "Chờ duyệt",
};

// Danh sách quốc gia có sẵn
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
};

// Default images per category for suggestion
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
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState<
    "hourly" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const [tableSalaryPeriod, setTableSalaryPeriod] = useState<
    "hourly" | "weekly" | "monthly" | "yearly"
  >("monthly");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObjRef = useRef<File | null>(null);

  const pendingJobs = jobs.filter((j) => j.status === "pending_review");
  const filtered = jobs.filter((j) => {
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getSalaryEstimates = (value: number, period: string) => {
    let monthly: number;
    switch (period) {
      case "hourly":
        monthly = (value * 40 * 52) / 12;
        break;
      case "weekly":
        monthly = (value * 52) / 12;
        break;
      case "yearly":
        monthly = value / 12;
        break;
      default:
        monthly = value;
    }
    const fmt = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toFixed(0);
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
    const isPreset = PRESET_COUNTRIES.some(
      (c) => c.value === job.country && c.value !== "__other__",
    );
    setForm({
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
    setUrlInput(job.image || "");
    fileObjRef.current = null;
    setEditing(job);
    setModal("edit");
  };

  // Handle file upload → lưu File object + tạo preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Ảnh tối đa 20MB");
      return;
    }
    fileObjRef.current = file;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((f) => ({ ...f, imagePreview: reader.result as string }));
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
    jobsApi
      .getAllAdmin({ search, limit: 50 })
      .then((r) => {
        setJobs(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoriesApi
      .getAllAdmin()
      .then((r) => setCats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadJobs();
  }, [search]);
  const handleSave = async () => {
    if (!form.title) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();

      // Gắn từng field, bỏ qua imagePreview, countryCustom và giá trị rỗng
      const skipKeys = ["imagePreview", "countryCustom"];
      Object.entries(form).forEach(([k, v]) => {
        if (skipKeys.includes(k)) return;
        if (v === "" || v === undefined || v === null) return;
        if (typeof v === "boolean") {
          fd.append(k, v ? "true" : "false");
        } else {
          fd.append(k, String(v));
        }
      });

      // Nếu chọn "Khác", ghi đè country bằng giá trị nhập tay
      if (form.country === "__other__") {
        if (!form.countryCustom.trim()) {
          toast.error("Vui lòng nhập tên quốc gia");
          setSaving(false);
          return;
        }
        fd.set("country", form.countryCustom.trim());
      }

      // Xử lý ảnh
      if (imgTab === "upload" && fileObjRef.current) {
        fd.append("image", fileObjRef.current);
      } else if (imgTab === "url" && urlInput.trim()) {
        fd.set("image", urlInput.trim());
      }

      // Nếu categoryId rỗng hoặc không hợp lệ thì xóa đi
      if (!form.categoryId || form.categoryId.length < 10) {
        fd.delete("categoryId");
      }

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
    } catch {
      toast.error("Xóa thất bại");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await jobsApi.approveJob(id);
      toast.success("Đã duyệt bài đăng — tin đã lên live");
      loadJobs();
    } catch {
      toast.error("Duyệt thất bại");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await jobsApi.rejectJob(id);
      toast.success("Đã từ chối bài đăng");
      loadJobs();
    } catch {
      toast.error("Từ chối thất bại");
    }
  };

  const set =
    (k: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    localStorage.setItem("lastSalaryCurrency", currency);
    setForm((f) => ({ ...f, salaryCurrency: currency }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Quản lý Việc làm
            {pendingJobs.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-400/20 text-amber-400 border border-amber-400/30 font-semibold">
                {pendingJobs.length} chờ duyệt
              </span>
            )}
          </h1>
          <p className="text-brand-muted text-sm">{jobs.length} bài đăng</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5"
        >
          <Plus size={15} /> Thêm bài đăng
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: "", label: "Tất cả", count: jobs.length },
          {
            value: "pending_review",
            label: "⏳ Chờ duyệt",
            count: jobs.filter((j) => j.status === "pending_review").length,
          },
          {
            value: "active",
            label: "✅ Hoạt động",
            count: jobs.filter((j) => j.status === "active").length,
          },
          {
            value: "paused",
            label: "⏸ Tạm dừng",
            count: jobs.filter((j) => j.status === "paused").length,
          },
          {
            value: "closed",
            label: "❌ Đã đóng",
            count: jobs.filter((j) => j.status === "closed").length,
          },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              statusFilter === tab.value
                ? "bg-brand-gold/15 border-brand-gold/40 text-brand-gold"
                : "border-brand-border text-brand-muted hover:border-white/20 hover:text-white"
            }`}
          >
            {tab.label}
            <span className="opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="card-dark p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-sm">
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 py-2 text-sm h-10"
            placeholder="Tìm tên việc, công ty..."
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-brand-muted whitespace-nowrap">
            Hiển thị lương:
          </span>
          <div className="flex rounded-lg border border-brand-border overflow-hidden text-xs">
            {(["hourly", "weekly", "monthly", "yearly"] as const).map((p) => {
              const label = {
                hourly: "Giờ",
                weekly: "Tuần",
                monthly: "Tháng",
                yearly: "Năm",
              }[p];
              return (
                <button
                  key={p}
                  onClick={() => setTableSalaryPeriod(p)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    tableSalaryPeriod === p
                      ? "bg-brand-gold/20 text-brand-gold"
                      : "text-brand-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
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
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">
                  Quốc gia
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">
                  Lương /{" "}
                  {
                    {
                      hourly: "Giờ",
                      weekly: "Tuần",
                      monthly: "Tháng",
                      yearly: "Năm",
                    }[tableSalaryPeriod]
                  }
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden lg:table-cell">
                  Nguồn đăng
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden lg:table-cell">
                  Ngày đăng
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
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-brand-border/40 hover:bg-white/[0.03] transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-dark border border-brand-border flex-shrink-0">
                      {job.image ? (
                        <img
                          src={getImageUrl(job.image)}
                          alt={job.title}
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
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {job.title}
                      </p>
                      <p className="text-brand-muted text-xs">{job.company}</p>
                      <div className="flex gap-1 mt-1">
                        {job.isHot && (
                          <span className="badge-hot text-[10px] px-1.5 py-0">
                            Hot
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="bg-brand-gold/20 text-brand-gold text-[10px] font-bold px-1.5 py-0 rounded-full">
                            Nổi bật
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="badge-country text-xs">
                      {getCountryLabels()[job.country]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {job.salaryMin || job.salaryMax ? (
                      <span className="text-brand-gold text-xs font-medium">
                        {(() => {
                          const cur = job.salaryCurrency || "";
                          if (tableSalaryPeriod === "monthly") {
                            return formatSalary(
                              job.salaryMin,
                              job.salaryMax,
                              cur,
                            );
                          }
                          const minE = job.salaryMin
                            ? getSalaryEstimates(job.salaryMin, "monthly")[
                                tableSalaryPeriod
                              ]
                            : null;
                          const maxE = job.salaryMax
                            ? getSalaryEstimates(job.salaryMax, "monthly")[
                                tableSalaryPeriod
                              ]
                            : null;
                          const range = [minE, maxE]
                            .filter(Boolean)
                            .join(" – ");
                          return range ? `${cur} ${range}` : "—";
                        })()}
                      </span>
                    ) : (
                      <span className="text-brand-muted text-xs">—</span>
                    )}
                  </td>
                  {/* Nguồn đăng */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {job.createdBy ? (
                      <div>
                        <p className="text-xs text-white font-medium truncate max-w-[120px]">
                          {job.createdBy.companyName || job.createdBy.fullName}
                        </p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-400/20 font-medium">
                          Doanh nghiệp
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/20 font-medium">
                        Fly Labour
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-brand-muted text-xs">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[job.status]}`}
                    >
                      {STATUS_LABELS[job.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === "pending_review" && (
                        <>
                          <button
                            onClick={() => handleApprove(job.id)}
                            title="Duyệt bài"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/10 transition-colors"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => handleReject(job.id)}
                            title="Từ chối"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <XCircle size={13} />
                          </button>
                        </>
                      )}
                      <a
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Eye size={13} />
                      </a>
                      <button
                        onClick={() => openEdit(job)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleting(job.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-brand-muted text-sm">
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      </div>

      {/* ══ Add/Edit Modal ══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setModal(null)}
          />
          <div className="relative bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border sticky top-0 bg-brand-card z-10">
              <h2 className="font-semibold text-white">
                {modal === "add"
                  ? "➕ Thêm bài đăng mới"
                  : "✏️ Chỉnh sửa bài đăng"}
              </h2>
              <button onClick={() => setModal(null)}>
                <X size={18} className="text-brand-muted hover:text-white" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* ── IMAGE UPLOAD SECTION ── */}
              <div className="space-y-3">
                <label className="text-xs text-brand-muted font-semibold uppercase tracking-wider block">
                  Ảnh bài đăng
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
                            fileObjRef.current = null;
                          }}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
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

                {/* Tabs: Upload vs URL */}
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
                      onKeyDown={(e) => e.key === "Enter" && applyUrlInput()}
                      className="input-dark flex-1 text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      onClick={applyUrlInput}
                      className="btn-primary px-4 text-sm whitespace-nowrap"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}

                {/* Suggested images by category */}
                {form.categoryId && SUGGESTED_IMAGES[form.categoryId] && (
                  <div className="flex items-center gap-3 p-3 bg-brand-gold/5 border border-brand-gold/15 rounded-xl">
                    <img
                      src={SUGGESTED_IMAGES[form.categoryId]}
                      alt="suggested"
                      className="w-12 h-10 rounded-lg object-cover border border-brand-border"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-brand-gold font-medium">
                        💡 Ảnh gợi ý theo danh mục
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        Ảnh mặc định phù hợp với ngành{" "}
                        {cats.find((c) => c.id === form.categoryId)?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => useSuggestedImage(form.categoryId)}
                      className="text-xs btn-outline px-3 py-1.5 whitespace-nowrap"
                    >
                      Dùng ảnh này
                    </button>
                  </div>
                )}
              </div>

              {/* ── JOB INFO ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Tiêu đề *
                  </label>
                  <input
                    value={form.title}
                    onChange={set("title")}
                    className="input-dark"
                    placeholder="VD: Công nhân Hái Quả Mùa Vụ"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Công ty
                  </label>
                  <input
                    value={form.company}
                    onChange={set("company")}
                    className="input-dark"
                    placeholder="Tên công ty"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Địa điểm
                  </label>
                  <input
                    value={form.location}
                    onChange={set("location")}
                    className="input-dark"
                    placeholder="VD: Sydney, NSW"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Quốc gia
                  </label>
                  <select
                    value={form.country}
                    onChange={set("country")}
                    className="input-dark"
                  >
                    {PRESET_COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {form.country === "__other__" && (
                    <input
                      value={form.countryCustom}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          countryCustom: e.target.value,
                        }))
                      }
                      className="input-dark mt-2"
                      placeholder="Nhập tên quốc gia (VD: Malaysia, Israel...)"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Loại hình
                  </label>
                  <select
                    value={form.jobType}
                    onChange={set("jobType")}
                    className="input-dark"
                  >
                    <option value="full_time">Toàn thời gian</option>
                    <option value="part_time">Bán thời gian</option>
                    <option value="contract">Hợp đồng</option>
                    <option value="seasonal">Theo mùa vụ</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Lương tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={set("salaryMin")}
                    className="input-dark"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Lương tối đa
                  </label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={set("salaryMax")}
                    className="input-dark"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Tiền tệ
                  </label>
                  <select
                    value={form.salaryCurrency}
                    onChange={handleCurrencyChange}
                    className="input-dark"
                  >
                    <option value="AUD">🇦🇺 AUD (Úc)</option>
                    <option value="CAD">🇨🇦 CAD (Canada)</option>
                    <option value="NZD">🇳🇿 NZD (New Zealand)</option>
                    <option value="USD">🇺🇸 USD (Mỹ)</option>
                    <option value="GBP">🇬🇧 GBP (Anh)</option>
                    <option value="EUR">🇪🇺 EUR (Châu Âu)</option>
                    <option value="JPY">🇯🇵 JPY (Nhật Bản)</option>
                    <option value="KRW">🇰🇷 KRW (Hàn Quốc)</option>
                    <option value="SGD">🇸🇬 SGD (Singapore)</option>
                    <option value="TWD">🇹🇼 TWD (Đài Loan)</option>
                    <option value="NOK">🇳🇴 NOK (Na Uy)</option>
                    <option value="CHF">🇨🇭 CHF (Thụy Sĩ)</option>
                    <option value="CNY">🇨🇳 CNY (Trung Quốc)</option>
                    <option value="THB">🇹🇭 THB (Thái Lan)</option>
                    <option value="INR">🇮🇳 INR (Ấn Độ)</option>
                    <option value="MYR">🇲🇾 MYR (Malaysia)</option>
                    <option value="IDR">🇮🇩 IDR (Indonesia)</option>
                    <option value="PHP">🇵🇭 PHP (Philippines)</option>
                    <option value="VND">🇻🇳 VND (Việt Nam)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Đơn vị lương nhập
                  </label>
                  <select
                    value={salaryPeriod}
                    onChange={(e) =>
                      setSalaryPeriod(
                        e.target.value as
                          | "hourly"
                          | "weekly"
                          | "monthly"
                          | "yearly",
                      )
                    }
                    className="input-dark"
                  >
                    <option value="hourly">Theo giờ</option>
                    <option value="weekly">Theo tuần</option>
                    <option value="monthly">Theo tháng</option>
                    <option value="yearly">Theo năm</option>
                  </select>
                </div>
                {(form.salaryMin || form.salaryMax) && (
                  <div className="sm:col-span-2 p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                    <p className="text-xs text-brand-gold font-semibold mb-2 flex items-center gap-1.5">
                      <Clock size={12} /> Ước lượng lương ({form.salaryCurrency}
                      )
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {(["hourly", "weekly", "monthly", "yearly"] as const).map(
                        (p) => {
                          const labels = {
                            hourly: "/ giờ",
                            weekly: "/ tuần",
                            monthly: "/ tháng",
                            yearly: "/ năm",
                          };
                          const minEst = form.salaryMin
                            ? getSalaryEstimates(
                                Number(form.salaryMin),
                                salaryPeriod,
                              )[p]
                            : null;
                          const maxEst = form.salaryMax
                            ? getSalaryEstimates(
                                Number(form.salaryMax),
                                salaryPeriod,
                              )[p]
                            : null;
                          return (
                            <div
                              key={p}
                              className={`rounded-lg p-2 text-center border ${p === salaryPeriod ? "border-brand-gold/40 bg-brand-gold/10" : "border-brand-border bg-brand-dark/40"}`}
                            >
                              <p className="text-[10px] text-brand-muted mb-1">
                                {labels[p]}
                              </p>
                              <p className="text-xs font-semibold text-white leading-tight">
                                {minEst && maxEst
                                  ? `${minEst} – ${maxEst}`
                                  : minEst || maxEst || "—"}
                              </p>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Số chỉ tiêu
                  </label>
                  <input
                    type="number"
                    value={form.slots}
                    onChange={set("slots")}
                    className="input-dark"
                    placeholder="Số lượng tuyển"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Hạn nộp hồ sơ
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={set("deadline")}
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Danh mục
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => {
                      set("categoryId")(e);
                      if (!form.imagePreview) useSuggestedImage(e.target.value);
                    }}
                    className="input-dark"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Trạng thái
                  </label>
                  <select
                    value={form.status}
                    onChange={set("status")}
                    className="input-dark"
                  >
                    <option
                      value="active"
                      style={{ backgroundColor: "#10b981", color: "#fff" }}
                    >
                      Hoạt động
                    </option>
                    <option
                      value="paused"
                      style={{ backgroundColor: "#f59e0b", color: "#000" }}
                    >
                      Tạm dừng
                    </option>
                    <option
                      value="closed"
                      style={{ backgroundColor: "#ef4444", color: "#fff" }}
                    >
                      Đã đóng
                    </option>
                    <option
                      value="draft"
                      style={{ backgroundColor: "#6b7280", color: "#fff" }}
                    >
                      Nháp
                    </option>
                  </select>
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isHot}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isHot: e.target.checked }))
                      }
                      className="w-4 h-4 accent-brand-orange"
                    />
                    <span className="text-sm text-white">🔥 Đánh dấu Hot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isFeatured: e.target.checked }))
                      }
                      className="w-4 h-4 accent-brand-gold"
                    />
                    <span className="text-sm text-white">⭐ Nổi bật</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Mô tả công việc *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={set("description")}
                    className="input-dark h-24 resize-none"
                    placeholder="Mô tả chi tiết..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Yêu cầu
                  </label>
                  <textarea
                    value={form.requirements}
                    onChange={set("requirements")}
                    className="input-dark h-20 resize-none"
                    placeholder="Yêu cầu đối với ứng viên..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1.5 block">
                    Quyền lợi
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={set("benefits")}
                    className="input-dark h-20 resize-none"
                    placeholder="Quyền lợi dành cho nhân viên..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <CheckCircle size={15} />{" "}
                  {modal === "add" ? "Đăng bài" : "Lưu thay đổi"}
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

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleting(null)}
          />
          <div className="relative bg-brand-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-white font-semibold mb-2">Xác nhận xóa?</h3>
            <p className="text-brand-muted text-sm mb-5">
              Bài đăng sẽ bị xóa vĩnh viễn.
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
