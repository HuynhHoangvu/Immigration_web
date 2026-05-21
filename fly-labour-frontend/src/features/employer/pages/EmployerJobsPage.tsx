import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Briefcase,
} from "lucide-react";
import { employerApi, categoriesApi, getImageUrl } from "@core/services/api";
import {
  getCountryLabels,
  getCountriesList,
  getJobTypeLabel,
  JOBTYPE_LABELS,
} from "@core/utils/helpers";
import toast from "react-hot-toast";
import type { Job, Category } from "@core/types";
import clsx from "clsx";
import s from "./EmployerJobsPage.module.scss";

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

const STATUS_BADGE: Record<string, string> = {
  active: s.statusActive,
  draft: s.statusDraft,
  paused: s.statusPaused,
  closed: s.statusClosed,
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

  const cardClasses = s.card;
  const inputClasses = s.input;

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.headTitle}>
            Tin tuyển dụng của tôi
          </h1>
          <p className={s.headSub}>
            {jobs.length} tin đăng đang được quản lý
          </p>
        </div>
        <button
          onClick={openCreate}
          className={clsx("btn-primary", s.createBtn)}
        >
          <Plus size={18} /> Đăng tin mới
        </button>
      </div>

      {loading ? (
        <div className={s.loadingList}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={clsx(s.loadingItem, "animate-pulse")} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className={clsx(cardClasses, s.empty)}>
          <div className={s.emptyIcon}>
            <Briefcase size={32} />
          </div>
          <p className={s.emptyTitle}>
            Chưa có tin tuyển dụng nào
          </p>
          <p className={clsx(s.emptySub, "fl-max-xs")}>
            Bắt đầu tìm kiếm ứng viên tiềm năng bằng cách tạo tin tuyển dụng đầu
            tiên của bạn.
          </p>
          <button
            onClick={openCreate}
            className={clsx("btn-primary", s.emptyBtn)}
          >
            Đăng tin ngay
          </button>
        </div>
      ) : (
        <div className={s.list}>
          {jobs.map((job) => (
            <div
              key={job.id}
              className={clsx(cardClasses, s.jobRow)}
            >
              <div className={s.thumb}>
                {job.image ? (
                  <img
                    src={getImageUrl(job.image)}
                    alt=""
                    className={s.thumbImage}
                  />
                ) : (
                  <div className={s.thumbFallback}>
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <div className={s.jobMain}>
                <div className={s.jobTitleRow}>
                  <h3 className={s.jobTitle}>
                    {job.title}
                  </h3>
                  <span
                    className={clsx(
                      s.statusBadge,
                      STATUS_BADGE[job.status] || s.statusPaused,
                    )}
                  >
                    {job.status === "active" ? "Đang tuyển" : job.status}
                  </span>
                </div>
                <div className={s.jobMeta}>
                  <span>{getCountryLabels()[job.country]}</span>
                  <span>•</span>
                  <span>{job.slots || 0} chỉ tiêu</span>
                  <span>•</span>
                  <span>{getJobTypeLabel(job.jobType)}</span>
                </div>
                <p className={s.jobViews}>
                  Lượt xem:{" "}
                  <span className={s.jobViewsStrong}>
                    {job.viewCount || 0}
                  </span>
                </p>
              </div>
              <div className={s.jobActions}>
                <button
                  onClick={() => openEdit(job)}
                  className={clsx(s.iconBtn, s.editBtn)}
                  title="Chỉnh sửa"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteId(job.id)}
                  className={clsx(s.iconBtn, s.deleteBtn)}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className={s.modalBackdrop}>
          <div className={clsx(s.modalCard, "animate-in fade-in zoom-in duration-200")}>
            <div className={s.modalHead}>
              <h2 className={s.modalTitle}>
                {editing
                  ? "Chỉnh sửa tin tuyển dụng"
                  : "Đăng tin tuyển dụng mới"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className={s.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={clsx(s.modalBody, "custom-scrollbar")}>
              {/* Vị trí & Công ty */}
              <div className={s.sectionGrid2}>
                <div className={s.span2}>
                  <label className={s.label}>
                    Tiêu đề tuyển dụng *
                  </label>
                  <input
                    value={form.title}
                    onChange={f("title")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="VD: Công nhân hái trái cây tại Úc"
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Tên doanh nghiệp
                  </label>
                  <input
                    value={form.company}
                    onChange={f("company")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="Tên công ty"
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Địa điểm cụ thể
                  </label>
                  <input
                    value={form.location}
                    onChange={f("location")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="Thành phố / Bang"
                  />
                </div>
              </div>

              {/* Quốc gia & Loại hình */}
              <div className={s.sectionGrid2}>
                <div>
                  <label className={s.label}>
                    Quốc gia *
                  </label>
                  <select
                    value={form.country}
                    onChange={f("country")}
                    className={clsx(inputClasses, s.inputH12, "appearance-none")}
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
                      className={clsx(inputClasses, s.inputH12, "mt-2")}
                      placeholder="Nhập tên quốc gia"
                    />
                  )}
                </div>
                <div>
                  <label className={s.label}>
                    Loại hình
                  </label>
                  <select
                    value={form.jobType}
                    onChange={f("jobType")}
                    className={clsx(inputClasses, s.inputH12, "appearance-none")}
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
              <div className={s.sectionGrid3}>
                <div>
                  <label className={s.label}>
                    Lương tối thiểu
                  </label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={f("salaryMin")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Lương tối đa
                  </label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={f("salaryMax")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="Max"
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Tiền tệ
                  </label>
                  <select
                    value={form.salaryCurrency}
                    onChange={handleCurrencyChange}
                    className={clsx(inputClasses, s.inputH12, "appearance-none")}
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
              <div className={s.sectionGrid3}>
                <div>
                  <label className={s.label}>
                    Chỉ tiêu
                  </label>
                  <input
                    type="number"
                    value={form.slots}
                    onChange={f("slots")}
                    className={clsx(inputClasses, s.inputH12)}
                    placeholder="Số lượng"
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Hạn nộp
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={f("deadline")}
                    className={clsx(inputClasses, s.inputH12)}
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Trạng thái
                  </label>
                  <select
                    value={form.status}
                    onChange={f("status")}
                    className={clsx(inputClasses, s.inputH12, "appearance-none font-bold")}
                  >
                    <option value="active" className={s.optionGreen}>
                      Đang tuyển
                    </option>
                    <option value="draft" className={s.optionSlate}>
                      Bản nháp
                    </option>
                    <option value="paused" className={s.optionAmber}>
                      Tạm dừng
                    </option>
                    <option value="closed" className={s.optionRed}>
                      Đã đóng
                    </option>
                  </select>
                </div>
              </div>

              {/* Ngành nghề & Ảnh */}
              <div className={s.sectionGrid2}>
                <div>
                  <label className={s.label}>
                    Ngành nghề
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={f("categoryId")}
                    className={clsx(inputClasses, s.inputH12, "appearance-none")}
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
                  <label className={s.label}>
                    Ảnh bìa
                  </label>
                  <div className={s.uploadRow}>
                    <label className={s.uploadBtn}>
                      <ImageIcon size={16} /> {preview ? "Thay đổi" : "Tải lên"}
                      <input
                        type="file"
                        accept="image/*"
                        className={s.inputHidden}
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
                      <div className={s.previewBox}>
                        <img
                          src={preview || getImageUrl(form.image)}
                          alt=""
                          className={s.previewImg}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Văn bản dài */}
              <div className={s.fieldGroup}>
                <div>
                  <label className={s.label}>
                    Mô tả công việc *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={f("description")}
                    className={clsx(s.textarea, "h-32")}
                    placeholder="Mô tả nhiệm vụ chính..."
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Yêu cầu ứng viên
                  </label>
                  <textarea
                    value={form.requirements}
                    onChange={f("requirements")}
                    className={clsx(s.textarea, "h-24")}
                    placeholder="Kỹ năng, kinh nghiệm..."
                  />
                </div>
                <div>
                  <label className={s.label}>
                    Quyền lợi
                  </label>
                  <textarea
                    value={form.benefits}
                    onChange={f("benefits")}
                    className={clsx(s.textarea, "h-24")}
                    placeholder="Lương thưởng, bảo hiểm, hỗ trợ..."
                  />
                </div>
              </div>
            </div>

            <div className={s.modalFoot}>
              <button
                onClick={() => setModal(false)}
                className={s.cancelBtn}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={clsx("btn-primary", s.saveBtn)}
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

      {deleteId && (
        <div className={s.deleteBackdrop}>
          <div className={clsx(s.deleteCard, "animate-in fade-in zoom-in duration-150")}>
            <div className={s.deleteIcon}>
              <Trash2 size={32} />
            </div>
            <h3 className={s.deleteTitle}>
              Xóa tin tuyển dụng?
            </h3>
            <p className={s.deleteText}>
              Dữ liệu tin tuyển dụng và hồ sơ ứng viên liên quan sẽ bị xóa vĩnh
              viễn khỏi hệ thống.
            </p>
            <div className={s.deleteActions}>
              <button
                onClick={() => setDeleteId(null)}
                className={s.cancelBtn}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className={s.confirmDeleteBtn}
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
