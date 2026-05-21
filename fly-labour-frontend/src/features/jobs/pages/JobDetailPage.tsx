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
} from "@core/utils/helpers";
import { useAuthStore } from "@core/store/authStore";
import { useT } from "@core/hooks/useT";
import {
  jobsApi,
  applicationsApi,
  uploadApi,
  getImageUrl,
} from "@core/services/api";
import type { Job } from "@core/types";
import toast from "react-hot-toast";
import clsx from "clsx";
import CountryFlag from "@components/widgets/CountryFlag";
import s from "./JobDetailPage.module.scss";



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
      <div className={`${s.centerState} fl-surface-page`}>
        <div className={`${s.spinner} animate-spin`} />
      </div>
    );

  if (!job)
    return (
      <div className={`${s.centerState} fl-surface-page`}>
        <div className={s.notFound}>
          <p className={s.notFoundEmoji}>😕</p>
          <p className={s.notFoundText}>
            {d.back}
          </p>
          <Link
            to="/jobs"
            className={clsx("btn-primary", s.notFoundBtn)}
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
  const eduOptions: string[] = d.eduOptions;
  const engOptions: string[] = d.engOptions;

  // CSS đồng bộ UI
  const cardClasses = s.card;

  // Input: Chữ thường (font-normal), màu xám nhẹ hơn để phân biệt với Label
  const inputClasses = s.input;

  // PHÂN CẤP CHỮ CHUẨN XÁC
  // 1. Tiêu đề chính: Đậm, rõ ràng
  const sectionTitleClasses = s.sectionTitle;
  // 2. Nội dung đoạn văn
  const bodyTextClasses = s.bodyText;
  // 3. Nhãn (Label form)
  const labelClasses = s.label;
  return (
    <div className={`${s.page} fl-surface-page`}>
      <div className={s.breadcrumb}>
        <div className={`fl-container-7xl ${s.breadcrumbInner}`}>
          <Link
            to="/"
            className={s.breadcrumbLink}
          >
            {d.home}
          </Link>
          <span>/</span>
          <Link
            to="/jobs"
            className={s.breadcrumbLink}
          >
            {d.jobs}
          </Link>
          <span>/</span>
          <span className={s.breadcrumbCurrent}>
            {job.title}
          </span>
        </div>
      </div>

      <div className={`fl-container-7xl ${s.content}`}>
        <div className={s.layout}>
          <div className={s.mainCol}>
            {/* Job Header Card */}
            <div className={cardClasses}>
              <div className="relative h-52 md:h-64 bg-slate-200  overflow-hidden">
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/30 shadow-lg">
                    <CountryFlag country={job.country} /> {countryName}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/30 shadow-lg">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {job.isHot && (
                    <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-red-600 text-white shadow-lg">
                      🔥 Hot
                    </span>
                  )}
                  {job.isFeatured && (
                    <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 shadow-lg">
                      {d.featured}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 relative">
                <div className="flex gap-2 flex-wrap mb-4">
                  {job.isHot && (
                    <span className="badge-hot font-bold">🔥 Hot</span>
                  )}
                  {job.isFeatured && (
                    <span className="bg-amber-100 text-amber-800   text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      {d.featured}
                    </span>
                  )}
                  <span className="badge-country font-medium border inline-flex items-center gap-1.5">
                    <CountryFlag country={job.country} /> {countryName}
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full border text-slate-800  bg-slate-100  border-slate-200 ">
                    {getJobTypeLabel(job.jobType)}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900  mb-3">
                  {job.title}
                </h1>
                {job.company && (
                  <div className="flex items-center gap-2 text-slate-800  text-base font-semibold mb-6">
                    <Building2 size={18} /> {job.company}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100  pt-5">
                  {/* Thu nhập — chiếm full width trên mobile nếu dài */}
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-medium text-slate-500  mb-1">
                      {d.salary}
                    </p>
                    <p className="text-amber-600  font-bold text-sm leading-snug break-words">
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryCurrency,
                      )}
                    </p>
                  </div>
                  {job.location && (
                    <div>
                      <p className="text-xs font-medium text-slate-500  mb-1">
                        {d.location}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 ">{job.location}</p>
                    </div>
                  )}
                  {job.slots && (
                    <div>
                      <p className="text-xs font-medium text-slate-500  mb-1">
                        {d.slots}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 ">
                        {job.slots} {d.slots_label}
                      </p>
                    </div>
                  )}
                  {job.deadline && (
                    <div>
                      <p className="text-xs font-medium text-slate-500  mb-1">
                        {d.deadline}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 ">{formatDate(job.deadline)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`${cardClasses} p-6 md:p-8`}>
              <h2 className={`${sectionTitleClasses} mb-4`}>
                {d.jobDescription}
              </h2>
              {d.originalLangWarning && (
                <div className="mb-4 text-xs font-medium text-amber-600  bg-amber-50  px-3 py-2 rounded-lg border border-amber-200  inline-flex items-center gap-2">
                  <span>🌐</span> {d.originalLangWarning}
                </div>
              )}
              <p className={`${bodyTextClasses} whitespace-pre-line`}>
                {job.description}
              </p>
            </div>

            {/* Requirements & Benefits Structured */}
            {(() => {
              let structReq: any = null;
              let structBen: any = null;
              try {
                if (job.requirements?.startsWith('{"v2":'))
                  structReq = JSON.parse(job.requirements).v2;
                if (job.benefits?.startsWith('{"v2":'))
                  structBen = JSON.parse(job.benefits).v2;
              } catch {}

              return (
                <div className="grid grid-cols-1 gap-6">
                  {/* Yêu cầu công việc block */}
                  <div className="bg-white  rounded-2xl border border-slate-200  overflow-hidden shadow-sm">
                    <div className="bg-slate-50  px-6 py-5 border-b border-slate-200 ">
                      <h3
                        className={`${sectionTitleClasses} flex items-center gap-3`}
                      >
                        <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span>
                        {d.requirements?.replace('📋 ', '') || 'Yêu cầu công việc'}
                      </h3>
                    </div>
                    <div>
                      <table className="w-full border-collapse">
                        <tbody className="divide-y divide-slate-100 ">
                          {[
                            { label: d.req_age || "Độ tuổi", value: structReq?.age },
                            {
                              label: d.req_workTime || "Thời gian làm việc",
                              value: structReq?.workTime,
                            },
                            {
                              label: d.req_exp || "Kinh nghiệm",
                              value: structReq?.experience,
                            },
                            { label: d.req_lang || "Ngoại ngữ", value: structReq?.language },
                          ].map((row, idx) => (
                            <tr
                              key={idx}
                              className="transition-colors hover:bg-slate-50 "
                            >
                              <td className="w-1/3 p-4 text-sm font-medium text-slate-700 ">
                                {row.label}
                              </td>
                              <td className="p-4 text-sm font-semibold text-slate-900 ">
                                {row.value || "—"}
                              </td>
                            </tr>
                          ))}
                          {structReq?.transport && (
                            <tr className="transition-colors hover:bg-slate-50 ">
                              <td className="p-4 text-sm font-medium text-slate-700 ">
                                {d.req_transport || "Phương tiện"}
                              </td>
                              <td className="p-4 text-sm font-semibold text-slate-900 ">
                                {structReq.transport}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td className="p-4 text-sm font-medium text-slate-700  align-top">
                              {d.req_other || "Yêu cầu khác"}
                            </td>
                            <td className="p-4">
                              {structReq?.other ? (
                                <p className={`${bodyTextClasses} whitespace-pre-line`}>
                                  {structReq.other}
                                </p>
                              ) : (
                                <span className="text-sm text-slate-400 ">—</span>
                              )}
                              {!structReq && job.requirements &&
                                !job.requirements.startsWith('{"v2":') && (
                                  <p
                                    className={`${bodyTextClasses} whitespace-pre-line`}
                                  >
                                    {job.requirements}
                                  </p>
                                )}
                            </td>
                          </tr>
                          {structReq?.checklist && structReq.checklist.length > 0 && (
                            <tr>
                              <td className="p-4 text-sm font-medium text-slate-700  align-top">
                                {d.req_checklist || "Các hồ sơ cần chuẩn bị"}
                              </td>
                              <td className="p-4">
                                <div className="space-y-3">
                                  {structReq.checklist.map((item: string) => (
                                    <div
                                      key={item}
                                      className="flex items-start gap-3"
                                    >
                                      <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-amber-50  flex items-center justify-center">
                                        <CheckCircle
                                          size={14}
                                          className="text-amber-600 "
                                        />
                                      </div>
                                      <span className="text-sm font-medium text-slate-900  leading-relaxed">
                                        {item}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quyền lợi block */}
                  <div className="bg-white  rounded-2xl border border-slate-200  overflow-hidden shadow-sm">
                    <div className="bg-slate-50  px-6 py-5 border-b border-slate-200 ">
                      <h3
                        className={`${sectionTitleClasses} flex items-center gap-3`}
                      >
                        <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span>
                        {d.benefits?.replace('🎁 ', '') || 'Quyền lợi đãi ngộ'}
                      </h3>
                    </div>
                    <div>
                      <table className="w-full border-collapse">
                        <tbody className="divide-y divide-slate-100 ">
                          {structBen?.departure && (
                            <tr className="transition-colors hover:bg-slate-50 ">
                              <td className="w-1/3 p-4 text-sm font-medium text-slate-700 ">
                                {d.ben_departure || "Thời gian xuất cảnh"}
                              </td>
                              <td className="p-4 text-sm font-semibold text-slate-900 ">
                                {structBen.departure}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td className="w-1/3 p-4 text-sm font-medium text-slate-700  align-top">
                              {d.ben_benefits || "Quyền lợi"}
                            </td>
                            <td className="p-4">
                              {structBen?.raw && !structBen.raw.startsWith('{"v2":') && !structBen.checklist?.length && (
                                <p className="text-sm font-medium text-slate-900  leading-relaxed mb-4 whitespace-pre-line">
                                  {structBen.raw}
                                </p>
                              )}
                              <div className="space-y-4">
                                {structBen?.checklist?.map((item: string) => (
                                  <div
                                    key={item}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-50  flex items-center justify-center">
                                      <CheckCircle
                                        size={14}
                                        className="text-green-600"
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-slate-900  leading-relaxed">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                                {(!structBen || !structBen.checklist?.length) &&
                                  job.benefits &&
                                  !job.benefits.startsWith('{"v2":') && (
                                    <p className="text-sm font-medium text-slate-900  leading-relaxed whitespace-pre-line">
                                      {job.benefits}
                                    </p>
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
              <div className={`${cardClasses} ${s.applyFormCard}`} id="apply-form">
                <h2 className={`${sectionTitleClasses} mb-6`}>
                  {d.applyTitle}
                </h2>
                <form onSubmit={handleSubmit} className={s.form}>
                  <div className={s.fieldGrid}>
                    <div>
                      <label className={`${labelClasses} mb-2 block`}>
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
                      <label className={`${labelClasses} mb-2 block`}>
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
                      <label className={`${labelClasses} mb-2 block`}>
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
                      <label className={`${labelClasses} mb-2 block`}>
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
                    <div className={s.colSpan2}>
                      <label className={`${labelClasses} ${s.labelBlock}`}>
                        {d.addressLabel}
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        className={`${inputClasses} ${s.inputH12}`}
                        placeholder={d.addressPlaceholder}
                      />
                    </div>
                    <div>
                      <label className={`${labelClasses} mb-2 block`}>
                        {d.education}
                      </label>
                      <select
                        value={form.education}
                        onChange={(e) =>
                          setForm({ ...form, education: e.target.value })
                        }
                        className={`${inputClasses} ${s.inputH12}`}
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
                      <label className={`${labelClasses} mb-2 block`}>
                        {d.english}
                      </label>
                      <select
                        value={form.languageLevel}
                        onChange={(e) =>
                          setForm({ ...form, languageLevel: e.target.value })
                        }
                        className={`${inputClasses} ${s.inputH12}`}
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
                    <div className={s.colSpan2}>
                      <label className={`${labelClasses} ${s.labelBlock}`}>
                        {d.experience}
                      </label>
                      <textarea
                        value={form.experience}
                        onChange={(e) =>
                          setForm({ ...form, experience: e.target.value })
                        }
                        className={`${inputClasses} ${s.textarea}`}
                        placeholder={d.expPlaceholder}
                      />
                    </div>
                    <div className={s.colSpan2}>
                      <label className={`${labelClasses} ${s.labelBlock}`}>
                        {d.coverLetter}
                      </label>
                      <textarea
                        value={form.coverLetter}
                        onChange={(e) =>
                          setForm({ ...form, coverLetter: e.target.value })
                        }
                        className={`${inputClasses} ${s.textarea}`}
                        placeholder={d.coverPlaceholder}
                      />
                    </div>
                    <div className={s.colSpan2}>
                      <label className={`${labelClasses} ${s.labelBlock}`}>
                        CV / Hồ sơ đính kèm (PDF, DOC)
                      </label>
                      <label
                        className={clsx(
                          s.uploadBox,
                          form.cvUrl && s.uploadBoxReady,
                        )}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvChange}
                          className={s.hiddenInput}
                          disabled={uploadingCv}
                        />
                        {uploadingCv ? (
                          <>
                            <span className={`${s.miniSpin} animate-spin`} />
                            <span className={s.uploadText}>
                              Đang tải lên hệ thống...
                            </span>
                          </>
                        ) : form.cvUrl ? (
                          <>
                            <FileText
                              size={20}
                              className={s.uploadSuccess}
                            />
                            <span className={`${s.uploadText} ${s.uploadSuccess}`}>
                              {cvFile?.name || "CV đã được đính kèm"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload
                              size={20}
                              className={s.uploadMuted}
                            />
                            <span className={`${s.uploadText} ${s.uploadMuted}`}>
                              Click để chọn file CV (Tối đa 10MB)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className={s.formActions}>
                    {/* Bỏ font-bold ở button, dùng font-semibold để gọn mắt hơn */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`btn-primary ${s.submitBtn}`}
                    >
                      {submitting ? (
                        <>
                          <span className={`${s.submitSpin} animate-spin`} />
                          {d.submitting}
                        </>
                      ) : (
                        d.submit
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className={s.cancelBtn}
                    >
                      {d.cancel}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className={`${cardClasses} ${s.successCard}`}>
                <CheckCircle
                  size={56}
                  className={s.successIcon}
                />
                <h3 className={s.successTitle}>
                  {d.successTitle}
                </h3>
                <p className={s.successSub}>
                  {d.successSub}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={s.sidebar}>
            <div className={`${cardClasses} ${s.stickyCard}`}>
              <div className={s.salaryHead}>
                <p className={s.salaryValue}>
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency,
                  )}
                </p>
                <p className={s.salarySub}>
                  {d.estSalary}
                </p>
              </div>

              {!submitted ? (
                job.deadline &&
                new Date(job.deadline) < new Date(new Date().toDateString()) ? (
                  <div className={`${s.statusBox} ${s.statusExpired}`}>
                    {d.expiredBtn || "Đã hết hạn nộp đơn"}
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    className={`btn-primary ${s.applyNowBtn}`}
                  >
                    {d.applyNow}
                  </button>
                )
              ) : (
                <div className={`${s.statusBox} ${s.statusApplied}`}>
                  {d.applied}
                </div>
              )}

              <p className={s.applyFree}>
                {d.applyFree}
              </p>

              <div className={s.metaList}>
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>
                    {d.posted}
                  </span>
                  <span className={s.metaValue}>
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                {job.deadline && (
                  <div className={s.metaRow}>
                    <span className={s.metaLabel}>
                      {d.closingDate}
                    </span>
                    <span className={`${s.metaValue} ${s.metaAccent}`}>
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
                <div className={s.metaRow}>
                  <span className={s.metaLabel}>
                    {d.views}
                  </span>
                  <span className={`${s.metaValue} ${s.viewsValue}`}>
                    <Eye size={16} />
                    {job.viewCount}
                  </span>
                </div>
              </div>
            </div>

            {relatedJobs.length > 0 && (
              <div className={`${cardClasses} ${s.relatedCard}`}>
                <h3 className={`${sectionTitleClasses} text-lg mb-5`}>
                  {d.related}
                </h3>
                <div className={s.relatedList}>
                  {relatedJobs.map((rj) => (
                    <Link
                      key={rj.id}
                      to={`/jobs/${rj.id}`}
                      className={s.relatedItem}
                    >
                      <p className={s.relatedTitle}>
                        {rj.title}
                      </p>
                      <p className={s.relatedCompany}>
                        {rj.company}
                      </p>
                      <p className={s.relatedSalary}>
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
