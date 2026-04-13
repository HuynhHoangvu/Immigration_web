import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Eye,
  CheckCircle,
  Building2,
  FileText,
  Upload,
} from "lucide-react";
import {
  getCountryLabels,
  getJobTypeLabel,
  formatSalary,
  formatDate,
} from "@/core/utils/helpers";
import { useAuthStore } from "@/core/store/authStore";
import { useT } from "@/core/hooks/useT";
import {
  jobsApi,
  applicationsApi,
  uploadApi,
  getImageUrl,
} from "@/core/services/api";
import type { Job } from "@/core/types";
import toast from "react-hot-toast";

const FLAG_MAP: Record<string, string> = {
  australia: "🇦🇺",
  canada: "🇨🇦",
  new_zealand: "🇳🇿",
  norway: "🇳🇴",
  germany: "🇩🇪",
  portugal: "🇵🇹",
  czech: "🇨🇿",
  us: "🇺🇸",
  uk: "🇬🇧",
  japan: "🇯🇵",
  singapore: "🇸🇬",
  south_korea: "🇰🇷",
  taiwan: "🇹🇼",
  uae: "🇦🇪",
};

const FALLBACK_IMAGES: Record<string, string> = {
  australia:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&fit=crop",
  canada:
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80&fit=crop",
  new_zealand:
    "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80&fit=crop",
  germany:
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80&fit=crop",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80&fit=crop",
  japan:
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80&fit=crop",
  south_korea:
    "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1200&q=80&fit=crop",
};

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useT();
  const d = t("jobDetail");

  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: "",
    address: user?.address || "",
    education: "",
    experience: "",
    languageLevel: "",
    coverLetter: "",
    cvUrl: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    jobsApi
      .getOne(id)
      .then((r) => {
        setJob(r.data);
        document.title = `${r.data.title} — Fly Labour`;
        jobsApi
          .getAll({ country: r.data.country, limit: 3 })
          .then((res) =>
            setRelatedJobs(res.data.data.filter((j: Job) => j.id !== id)),
          )
          .catch(() => {});
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
    return () => {
      document.title = "Fly Labour — Việc làm nước ngoài";
    };
  }, [id]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300 pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300 pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-slate-900 dark:text-white font-semibold mb-2">
            {d.back}
          </p>
          <Link
            to="/jobs"
            className="btn-primary inline-block text-sm px-5 py-2"
          >
            {d.back}
          </Link>
        </div>
      </div>
    );

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error(d.loginRequired);
      navigate("/login");
      return;
    }
    setShowForm(true);
    setTimeout(
      () =>
        document
          .getElementById("apply-form")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleCvChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setUploadingCv(true);
    try {
      const res = await uploadApi.cv(file);
      setForm((f) => ({ ...f, cvUrl: res.data.url }));
      toast.success("Đã upload CV");
    } catch {
      toast.error("Upload CV thất bại");
      setCvFile(null);
    } finally {
      setUploadingCv(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      toast.error(d.formRequired);
      return;
    }
    setSubmitting(true);
    try {
      await applicationsApi.create({ ...form, jobId: job.id });
      setSubmitted(true);
      toast.success(d.submitSuccess);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || d.submitFail);
    } finally {
      setSubmitting(false);
    }
  };

  const countryLabels = getCountryLabels();
  const countryLabel = countryLabels[job.country] ?? job.country;
  const countryName = countryLabel
    .replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "")
    .trim();
  const flag = FLAG_MAP[job.country] ?? "";
  const eduOptions: string[] = d.eduOptions;
  const engOptions: string[] = d.engOptions;

  // Lớp CSS tái sử dụng chung cho các thẻ Card
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none overflow-hidden transition-colors";
  // Lớp CSS tái sử dụng chung cho Input/Select/Textarea
  const inputClasses =
    "w-full text-sm rounded-xl px-4 bg-slate-100 dark:bg-[#1e1e1e] border border-transparent dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-black focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300 pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-brand-border bg-white/60 dark:bg-brand-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-slate-500 dark:text-brand-muted">
          <Link
            to="/"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {d.home}
          </Link>
          <span>/</span>
          <Link
            to="/jobs"
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {d.jobs}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-xs">
            {job.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> {d.back}
            </Link>

            {/* Job header card */}
            <div className={cardClasses}>
              <div className="relative h-52 md:h-64 bg-slate-200 dark:bg-brand-dark overflow-hidden">
                <img
                  src={
                    job.image ||
                    FALLBACK_IMAGES[job.country] ||
                    FALLBACK_IMAGES["australia"]
                  }
                  alt={job.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="badge-country backdrop-blur-sm bg-black/50 text-white">
                    {flag} {countryName}
                  </span>
                  <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full border border-white/20">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {job.isHot && (
                    <span className="badge-hot backdrop-blur-sm bg-red-500/90 text-white">
                      🔥 Hot
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="bg-brand-gold/90 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {d.featured}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 relative">
                <div className="flex gap-2 flex-wrap mb-4">
                  {job.isHot && <span className="badge-hot">🔥 Hot</span>}
                  {job.isFeatured && (
                    <span className="bg-amber-100 text-amber-800 dark:bg-brand-gold/20 dark:text-brand-gold text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                      {d.featured}
                    </span>
                  )}
                  <span className="badge-country border dark:border-transparent">
                    {flag} {countryName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-gray-700/40 border-slate-300 dark:border-gray-600">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {job.title}
                </h1>
                {job.company && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-brand-muted text-sm mb-5">
                    <Building2 size={14} /> {job.company}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 border-t border-slate-100 dark:border-white/5 pt-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-1.5">{d.salary}</p>
                    <p className="text-amber-700 dark:text-brand-gold font-bold text-base">
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </p>
                  </div>
                  {job.location && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-1.5">{d.location}</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm">
                        {job.location}
                      </p>
                    </div>
                  )}
                  {job.slots && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-1.5">{d.slots}</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm">
                        {job.slots} {d.slots_label}
                      </p>
                    </div>
                  )}
                  {job.deadline && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-brand-muted uppercase tracking-widest mb-1.5">{d.deadline}</p>
                      <p className="text-slate-900 dark:text-white font-bold text-sm">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`${cardClasses} p-6`}>
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">
                {d.jobDescription}
              </h2>
              <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements & Benefits Structured */}
            {(() => {
              let structReq: any = null;
              let structBen: any = null;
              try {
                if (job.requirements?.startsWith('{"v2":')) structReq = JSON.parse(job.requirements).v2;
                if (job.benefits?.startsWith('{"v2":')) structBen = JSON.parse(job.benefits).v2;
              } catch {}

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yêu cầu công việc block */}
                  <div className={`${cardClasses} flex flex-col`}>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">YÊU CẦU CÔNG VIỆC</h3>
                    </div>
                    <div className="p-0 flex-1">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {[
                            { label: "ĐỘ TUỔI", value: structReq?.age },
                            { label: "THỜI GIAN LÀM VIỆC", value: structReq?.workTime },
                            { label: "KINH NGHIỆM", value: structReq?.experience },
                            { label: "NGOẠI NGỮ", value: structReq?.language },
                          ].map((row, idx) => (
                            <tr key={idx} className="group">
                              <td className="w-1/3 p-4 font-bold text-slate-400 dark:text-brand-muted bg-slate-50/50 dark:bg-black/10 group-hover:bg-slate-100 dark:group-hover:bg-white/5 transition-colors">{row.label}</td>
                              <td className="p-4 text-slate-700 dark:text-white font-medium group-hover:bg-slate-50 dark:group-hover:bg-white/5 transition-colors">{row.value || "—"}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="p-4 font-bold text-slate-400 dark:text-brand-muted bg-slate-50/50 dark:bg-black/10">YÊU CẦU KHÁC</td>
                            <td className="p-4">
                              <div className="space-y-2">
                                {structReq?.other && (
                                  <p className="text-slate-700 dark:text-gray-300 mb-3 whitespace-pre-line">{structReq.other}</p>
                                )}
                                {structReq?.checklist?.map((item: string) => (
                                  <div key={item} className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                                    <div className="w-4 h-4 rounded-md border border-amber-400 dark:border-brand-gold flex items-center justify-center bg-amber-50 dark:bg-brand-gold/10">
                                      <CheckCircle size={10} className="text-amber-600 dark:text-brand-gold" />
                                    </div>
                                    <span>{item}</span>
                                  </div>
                                ))}
                                {!structReq && job.requirements && (
                                  <p className="text-slate-700 dark:text-gray-300 whitespace-pre-line">{job.requirements}</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quyền lợi block */}
                  <div className={`${cardClasses} flex flex-col`}>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">QUYỀN LỢI ĐÃI NGỘ</h3>
                    </div>
                    <div className="p-0 flex-1">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          <tr>
                            <td className="w-1/3 p-4 font-bold text-slate-400 dark:text-brand-muted bg-slate-50/50 dark:bg-black/10">THỜI GIAN XUẤT CẢNH</td>
                            <td className="p-4 text-slate-900 dark:text-white font-bold">{structBen?.departure || "—"}</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-slate-400 dark:text-brand-muted bg-slate-50/50 dark:bg-black/10 align-top">QUYỀN LỢI</td>
                            <td className="p-4">
                              <div className="space-y-3">
                                {structBen?.checklist?.map((item: string) => (
                                  <div key={item} className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                                    <div className="w-4 h-4 rounded-md border border-green-400 flex items-center justify-center bg-green-50 dark:bg-green-500/10">
                                      <CheckCircle size={10} className="text-green-600" />
                                    </div>
                                    <span>{item}</span>
                                  </div>
                                ))}
                                {(!structBen || !structBen.checklist?.length) && job.benefits && (
                                  <p className="text-slate-700 dark:text-gray-300 whitespace-pre-line">{structBen?.raw || job.benefits}</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Apply form */}
            {showForm && !submitted && (
              <div className={`${cardClasses} p-6`} id="apply-form">
                <h2 className="font-semibold text-slate-900 dark:text-white text-lg mb-6">
                  {d.applyTitle}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.fullName}
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                        placeholder={d.namePlaceholder}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.phoneLabel}
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                        placeholder={d.phonePlaceholder}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.dob}
                      </label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          setForm({ ...form, dateOfBirth: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.addressLabel}
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                        placeholder={d.addressPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.education}
                      </label>
                      <select
                        value={form.education}
                        onChange={(e) =>
                          setForm({ ...form, education: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                      >
                        {eduOptions.map((opt) => (
                          <option
                            key={opt}
                            value={opt === eduOptions[0] ? "" : opt}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.english}
                      </label>
                      <select
                        value={form.languageLevel}
                        onChange={(e) =>
                          setForm({ ...form, languageLevel: e.target.value })
                        }
                        className={`${inputClasses} h-12`}
                      >
                        {engOptions.map((opt) => (
                          <option
                            key={opt}
                            value={opt === engOptions[0] ? "" : opt}
                          >
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.experience}
                      </label>
                      <textarea
                        value={form.experience}
                        onChange={(e) =>
                          setForm({ ...form, experience: e.target.value })
                        }
                        className={`${inputClasses} h-24 p-4 resize-none`}
                        placeholder={d.expPlaceholder}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        {d.coverLetter}
                      </label>
                      <textarea
                        value={form.coverLetter}
                        onChange={(e) =>
                          setForm({ ...form, coverLetter: e.target.value })
                        }
                        className={`${inputClasses} h-28 p-4 resize-none`}
                        placeholder={d.coverPlaceholder}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-slate-600 dark:text-brand-muted font-medium mb-1.5 block">
                        CV / Hồ sơ (PDF, DOC)
                      </label>
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                          form.cvUrl
                            ? "border-green-500/40 bg-green-50 dark:bg-green-500/5"
                            : "border-slate-300 dark:border-brand-border hover:border-amber-400 dark:hover:border-brand-gold/40 bg-slate-50 dark:bg-brand-dark"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvChange}
                          className="hidden"
                          disabled={uploadingCv}
                        />
                        {uploadingCv ? (
                          <>
                            <span className="w-4 h-4 border-2 border-amber-500 dark:border-brand-gold border-t-transparent rounded-full animate-spin shrink-0" />
                            <span className="text-sm text-slate-500 dark:text-brand-muted">
                              Đang upload...
                            </span>
                          </>
                        ) : form.cvUrl ? (
                          <>
                            <FileText
                              size={16}
                              className="text-green-600 dark:text-green-400 shrink-0"
                            />
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium truncate">
                              {cvFile?.name || "CV đã upload"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload
                              size={16}
                              className="text-slate-400 dark:text-brand-muted shrink-0"
                            />
                            <span className="text-sm text-slate-500 dark:text-brand-muted">
                              Click để chọn file CV (tối đa 10MB)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                          {d.submitting}
                        </>
                      ) : (
                        d.submit
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-xl font-medium border border-slate-300 dark:border-brand-border text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      {d.cancel}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div
                className={`${cardClasses} p-8 text-center border-green-500/30 dark:border-green-500/30`}
              >
                <CheckCircle
                  size={48}
                  className="text-green-500 dark:text-green-400 mx-auto mb-3"
                />
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">
                  {d.successTitle}
                </h3>
                <p className="text-slate-500 dark:text-brand-muted text-sm">
                  {d.successSub}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className={`${cardClasses} p-5 sticky top-24`}>
              <div className="text-center mb-5">
                <p className="text-amber-600 dark:text-brand-gold font-bold text-2xl mb-0.5">
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency,
                  )}
                </p>
                <p className="text-slate-500 dark:text-brand-muted text-xs">
                  {d.estSalary}
                </p>
              </div>
              {!submitted ? (
                job.deadline &&
                new Date(job.deadline) < new Date(new Date().toDateString()) ? (
                  <div className="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-center text-sm font-medium">
                    Đã hết hạn nộp đơn
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                  >
                    {d.applyNow}
                  </button>
                )
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-600 dark:text-green-400 text-center text-sm font-medium">
                  {d.applied}
                </div>
              )}
              <p className="text-center text-xs text-slate-500 dark:text-brand-muted mt-3">
                {d.applyFree}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-brand-border space-y-2 text-xs text-slate-500 dark:text-brand-muted">
                <div className="flex justify-between">
                  <span>{d.posted}</span>
                  <span className="text-slate-900 font-medium dark:text-white dark:font-normal">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span>{d.closingDate}</span>
                    <span className="text-amber-600 font-medium dark:text-brand-orange dark:font-normal">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{d.views}</span>
                  <span className="text-slate-900 font-medium dark:text-white dark:font-normal flex items-center gap-1">
                    <Eye size={11} />
                    {job.viewCount}
                  </span>
                </div>
              </div>
            </div>

            {relatedJobs.length > 0 && (
              <div className={`${cardClasses} p-5`}>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
                  {d.related}
                </h3>
                <div className="space-y-3">
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj.id}
                      to={`/jobs/${rj.id}`}
                      className="block p-3 bg-slate-50 border border-transparent dark:bg-white/5 rounded-xl hover:border-slate-300 dark:hover:border-white/20 transition-colors group"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors line-clamp-1">
                        {rj.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-brand-muted mt-0.5">
                        {rj.company}
                      </p>
                      <p className="text-xs font-semibold text-amber-600 dark:text-brand-gold mt-1">
                        {formatSalary(
                          rj.salaryMin,
                          rj.salaryMax,
                          rj.salaryCurrency,
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
