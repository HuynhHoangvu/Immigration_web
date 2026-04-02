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
  Globe,
  FileText,
  Upload,
} from "lucide-react";
import {
  getCountryLabels,
  getJobTypeLabel,
  formatSalary,
  formatDate,
} from "@/utils/helpers";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/hooks/useT";
import {
  jobsApi,
  applicationsApi,
  uploadApi,
  getImageUrl,
} from "@/services/api";
import type { Job } from "@/types";
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

// Gallery ảnh theo quốc gia (3 ảnh cảnh quan + cuộc sống)
const COUNTRY_GALLERY: Record<string, string[]> = {
  australia: [
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=75",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75",
    "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&q=75",
  ],
  canada: [
    "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=75",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=75",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=75",
  ],
  new_zealand: [
    "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=75",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=75",
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=75",
  ],
  germany: [
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=75",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=75",
    "https://images.unsplash.com/photo-1564415314949-f8a4c1f4f7a0?w=800&q=75",
  ],
  uk: [
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=75",
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=75",
    "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=75",
  ],
};
const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=75",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=75",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=75",
];

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
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white font-semibold mb-2">{d.back}</p>
          <Link to="/jobs" className="btn-primary text-sm px-5 py-2">
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

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-brand-border bg-brand-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-brand-muted">
          <Link to="/" className="hover:text-white transition-colors">
            {d.home}
          </Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-white transition-colors">
            {d.jobs}
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{job.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> {d.back}
            </Link>

            {/* Job header card */}
            <div className="card-dark overflow-hidden">
              <div className="relative h-52 md:h-64 bg-brand-dark overflow-hidden">
                <img
                  src={
                    job.image ||
                    FALLBACK_IMAGES[job.country] ||
                    FALLBACK_IMAGES["australia"]
                  }
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="badge-country backdrop-blur-sm bg-black/40">
                    {flag} {countryName}
                  </span>
                  <span className="bg-black/40 backdrop-blur-sm text-slate-900 text-xs px-2.5 py-0.5 rounded-full border border-white/20">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {job.isHot && (
                    <span className="badge-hot backdrop-blur-sm">🔥 Hot</span>
                  )}
                  {job.isFeatured && (
                    <span className="bg-brand-gold/90 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {d.featured}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-2 flex-wrap mb-4">
                  {job.isHot && <span className="badge-hot">🔥 Hot</span>}
                  {job.isFeatured && (
                    <span className="bg-brand-gold/20 text-brand-gold text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                      {d.featured}
                    </span>
                  )}
                  <span className="badge-country">
                    {flag} {countryName}
                  </span>
                  <span className="bg-white/5 text-slate-900 text-xs px-2 py-0.5 rounded border border-white/10">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {job.title}
                </h1>
                {job.company && (
                  <div className="flex items-center gap-1.5 text-brand-muted text-sm mb-5">
                    <Building2 size={14} /> {job.company}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl p-3 text-center">
                    <TrendingUp
                      size={16}
                      className="text-brand-gold mx-auto mb-1"
                    />
                    <p className="text-brand-gold font-semibold text-sm">
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryCurrency,
                      )}
                    </p>
                    <p className="text-brand-muted text-xs">{d.salary}</p>
                  </div>
                  {job.location && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <MapPin
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {job.location}
                      </p>
                      <p className="text-brand-muted text-xs">{d.location}</p>
                    </div>
                  )}
                  {job.slots && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {job.slots} {d.slots_label}
                      </p>
                      <p className="text-brand-muted text-xs">{d.slots}</p>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Calendar
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {formatDate(job.deadline)}
                      </p>
                      <p className="text-brand-muted text-xs">{d.deadline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photo gallery */}
            {(() => {
              const countryGallery =
                COUNTRY_GALLERY[job.country] ?? DEFAULT_GALLERY;
              return (
                <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                  <div className="col-span-2 h-48 overflow-hidden">
                    <img
                      src={countryGallery[0]}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex-1 overflow-hidden">
                      <img
                        src={countryGallery[1]}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <img
                        src={countryGallery[2]}
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Description */}
            <div className="card-dark p-6">
              <h2 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Globe size={18} className="text-brand-gold" />{" "}
                {d.jobDescription}
              </h2>
              <p className="text-slate-900 leading-relaxed text-sm whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div className="card-dark p-6">
                <h2 className="font-semibold text-white text-lg mb-4">
                  {d.requirements}
                </h2>
                <p className="text-slate-900 leading-relaxed text-sm whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            {job.benefits && (
              <div className="card-dark p-6">
                <h2 className="font-semibold text-white text-lg mb-4">
                  {d.benefits}
                </h2>
                <div className="space-y-2">
                  {job.benefits
                    .split(".")
                    .filter(Boolean)
                    .map((b, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-900"
                      >
                        <CheckCircle
                          size={15}
                          className="text-green-400 mt-0.5 shrink-0"
                        />
                        {b.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Apply form */}
            {showForm && !submitted && (
              <div className="card-dark p-6" id="apply-form">
                <h2 className="font-semibold text-white text-lg mb-6">
                  {d.applyTitle}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.fullName}
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        className="input-dark"
                        placeholder={d.namePlaceholder}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.phoneLabel}
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="input-dark"
                        placeholder={d.phonePlaceholder}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.emailLabel}
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="input-dark"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.dob}
                      </label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          setForm({ ...form, dateOfBirth: e.target.value })
                        }
                        className="input-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.addressLabel}
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        className="input-dark"
                        placeholder={d.addressPlaceholder}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.education}
                      </label>
                      <select
                        value={form.education}
                        onChange={(e) =>
                          setForm({ ...form, education: e.target.value })
                        }
                        className="input-dark"
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
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.english}
                      </label>
                      <select
                        value={form.languageLevel}
                        onChange={(e) =>
                          setForm({ ...form, languageLevel: e.target.value })
                        }
                        className="input-dark"
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
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.experience}
                      </label>
                      <textarea
                        value={form.experience}
                        onChange={(e) =>
                          setForm({ ...form, experience: e.target.value })
                        }
                        className="input-dark h-24 resize-none"
                        placeholder={d.expPlaceholder}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        {d.coverLetter}
                      </label>
                      <textarea
                        value={form.coverLetter}
                        onChange={(e) =>
                          setForm({ ...form, coverLetter: e.target.value })
                        }
                        className="input-dark h-28 resize-none"
                        placeholder={d.coverPlaceholder}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        CV / Hồ sơ (PDF, DOC)
                      </label>
                      <label
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${form.cvUrl ? "border-green-500/40 bg-green-500/5" : "border-brand-border hover:border-brand-gold/40 bg-brand-dark"}`}
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
                            <span className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin shrink-0" />
                            <span className="text-sm text-brand-muted">
                              Đang upload...
                            </span>
                          </>
                        ) : form.cvUrl ? (
                          <>
                            <FileText
                              size={16}
                              className="text-green-400 shrink-0"
                            />
                            <span className="text-sm text-green-400 truncate">
                              {cvFile?.name || "CV đã upload"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload
                              size={16}
                              className="text-brand-muted shrink-0"
                            />
                            <span className="text-sm text-brand-muted">
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
                      className="btn-outline px-6"
                    >
                      {d.cancel}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className="card-dark p-8 text-center border-green-500/30">
                <CheckCircle
                  size={48}
                  className="text-green-400 mx-auto mb-3"
                />
                <h3 className="text-white font-semibold text-lg mb-2">
                  {d.successTitle}
                </h3>
                <p className="text-brand-muted text-sm">{d.successSub}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card-dark p-5 sticky top-24">
              <div className="text-center mb-5">
                <p className="text-brand-gold font-semibold text-xl mb-0.5">
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency,
                  )}
                </p>
                <p className="text-brand-muted text-xs">{d.estSalary}</p>
              </div>
              {!submitted ? (
                job.deadline &&
                new Date(job.deadline) < new Date(new Date().toDateString()) ? (
                  <div className="w-full py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm font-medium">
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
                <div className="w-full py-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center text-sm font-medium">
                  {d.applied}
                </div>
              )}
              <p className="text-center text-xs text-brand-muted mt-3">
                {d.applyFree}
              </p>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-2 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>{d.posted}</span>
                  <span className="text-white">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span>{d.closingDate}</span>
                    <span className="text-brand-orange">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{d.views}</span>
                  <span className="text-white flex items-center gap-1">
                    <Eye size={11} />
                    {job.viewCount}
                  </span>
                </div>
              </div>
            </div>

            {relatedJobs.length > 0 && (
              <div className="card-dark p-5">
                <h3 className="font-semibold text-white text-sm mb-4">
                  {d.related}
                </h3>
                <div className="space-y-3">
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj.id}
                      to={`/jobs/${rj.id}`}
                      className="block p-3 bg-brand-dark rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <p className="text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                        {rj.title}
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {rj.company}
                      </p>
                      <p className="text-xs text-brand-gold mt-1">
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
