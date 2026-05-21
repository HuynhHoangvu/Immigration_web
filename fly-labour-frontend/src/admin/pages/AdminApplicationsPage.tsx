import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  ChevronDown,
  User,
  Briefcase,
  FileText,
  Plus,
} from "lucide-react";
import type { Application, AppStatus, Job } from "@core/types";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import { applicationsApi, jobsApi } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminApplicationsPage.module.scss";

const STATUS_OPTIONS: AppStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "withdrawn",
];

// Form types for add application modal
type AddAppForm = {
  fullName: string;
  email: string;
  phone: string;
  jobId: string;
  dateOfBirth: string;
  address: string;
  education: string;
  experience: string;
  languageLevel: string;
  coverLetter: string;
};

const EMPTY_FORM: AddAppForm = {
  fullName: "",
  email: "",
  phone: "",
  jobId: "",
  dateOfBirth: "",
  address: "",
  education: "",
  experience: "",
  languageLevel: "",
  coverLetter: "",
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "">("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [adminNote, setAdminNote] = useState("");
  
  // Add application modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<AddAppForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadApps = () => {
    setLoading(true);
    applicationsApi
      .getAll({ status: filterStatus || undefined, limit: 50 })
      .then((r) => {
        setApps(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    applicationsApi
      .getStats()
      .then((r) => {
        const counts: Record<string, number> = {};
        r.data.forEach((i: any) => {
          counts[i.status] = parseInt(i.count, 10);
        });
        setStatusCounts(counts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadApps();
  }, [filterStatus]);

  const filtered = apps.filter(
    (a) =>
      !search ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const updateStatus = async (id: string, status: AppStatus, note?: string) => {
    setUpdatingId(id);
    try {
      await applicationsApi.updateStatus(id, status, note);
      setApps((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id) setSelected((old) => (old ? { ...old, status } : null));
      toast.success("Đã cập nhật trạng thái");
      applicationsApi.getStats().then((r) => {
        const counts: Record<string, number> = {};
        r.data.forEach((i: any) => {
          counts[i.status] = parseInt(i.count, 10);
        });
        setStatusCounts(counts);
      });
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

const totalAll = Object.values(statusCounts).reduce((sum, v) => sum + v, 0);

  // Load jobs for add application modal
  useEffect(() => {
    if (showAddModal && jobs.length === 0) {
      jobsApi.getAll({ status: "active", limit: 100 }).then((r) => {
        setJobs(r.data.data);
      }).catch(() => {});
    }
  }, [showAddModal]);

  // Handle add new application
  const handleAddApplication = async () => {
    if (!addForm.fullName.trim()) { toast.error("Vui lòng nhập họ tên"); return; }
    if (!addForm.email.trim()) { toast.error("Vui lòng nhập email"); return; }
    if (!addForm.phone.trim()) { toast.error("Vui lòng nhập số điện thoại"); return; }
    if (!addForm.jobId) { toast.error("Vui lòng chọn vị trí ứng tuyển"); return; }
    
    setSaving(true);
    try {
      await applicationsApi.create({
        fullName: addForm.fullName.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim(),
        jobId: addForm.jobId,
        dateOfBirth: addForm.dateOfBirth || undefined,
        address: addForm.address || undefined,
        education: addForm.education || undefined,
        experience: addForm.experience || undefined,
        languageLevel: addForm.languageLevel || undefined,
        coverLetter: addForm.coverLetter || undefined,
      });
      toast.success("Đã thêm đơn ứng tuyển mới");
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
      loadApps();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi thêm đơn");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.page}>
<div className={s.head}>
        <div>
          <h1 className={s.title}>Đơn ứng tuyển</h1>
          <p className={s.sub}>
            Tổng {total} đơn hồ sơ ·{" "}
            <span className={s.subAccent}>{statusCounts.pending || 0} đang chờ duyệt</span>
          </p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); setAddForm(EMPTY_FORM); }}
          className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shadow-lg shadow-amber-500/20"
        >
          <Plus size={18} /> Thêm đơn
        </button>
      </div>

      <div className={clsx(s.card, s.filterBar)}>
        <div className={s.searchWrap}>
          <Search size={16} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={s.searchInput}
            placeholder="Tìm theo tên ứng viên, email..."
          />
        </div>
        <div className={s.chipRow}>
          <button
            onClick={() => setFilterStatus("")}
            className={clsx(s.chip, !filterStatus ? s.chipActiveAll : s.chipIdle)}
          >
            Tất cả ({totalAll})
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={clsx(
                s.chip,
                filterStatus === status
                  ? APP_STATUS_LABELS[status].color
                  : s.chipIdle,
              )}
            >
              {APP_STATUS_LABELS[status].label} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className={clsx(s.card, s.tableCard)}>
        <div className={clsx(s.tableWrap, "custom-scrollbar")}>
          <table className={s.table}>
            <thead>
              <tr className={s.theadRow}>
                <th className={s.th}>Ứng viên</th>
                <th className={clsx(s.th, s.thSm)}>Vị trí ứng tuyển</th>
                <th className={clsx(s.th, s.thMd)}>Ngày nộp</th>
                <th className={s.th}>Trạng thái</th>
                <th className={clsx(s.th, s.thRight)}>Thao tác</th>
              </tr>
            </thead>
            <tbody className={s.tbody}>
              {loading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className={s.loadingCell}>
                        <div className={s.skeleton} />
                      </td>
                    </tr>
                  ))
                : filtered.map((app) => (
                    <tr key={app.id} className={s.row}>
                      <td className={s.th}>
                        <div className={s.cand}>
                          <div className={s.avatar}>{app.fullName.charAt(0)}</div>
                          <div className={s.candMain}>
                            <p className={s.candName}>{app.fullName}</p>
                            <p className={s.candPhone}>{app.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className={clsx(s.th, s.tdSm)}>
                        <p className={s.jobTitle}>{app.job?.title}</p>
                        <p className={s.jobCompany}>{app.job?.company}</p>
                      </td>
                      <td className={clsx(s.th, s.tdMd)}>
                        <p className={s.date}>{formatDate(app.createdAt)}</p>
                      </td>
                      <td className={s.th}>
                        <div className={s.statusSelectWrap}>
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(app.id, e.target.value as AppStatus)}
                            disabled={updatingId === app.id}
                            className={clsx(s.statusSelect, APP_STATUS_LABELS[app.status].color)}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {APP_STATUS_LABELS[status].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className={s.statusArrow} />
                        </div>
                      </td>
                      <td className={clsx(s.th, s.tdRight)}>
                        <button
                          onClick={() => {
                            setSelected(app);
                            setAdminNote("");
                          }}
                          className={s.eyeBtn}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className={s.empty}>
              <span className={s.emptyEmoji}>🔍</span>
              <p className={s.emptyText}>Không tìm thấy đơn ứng tuyển nào phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className={s.drawerRoot}>
          <div className={s.drawerBackdrop} onClick={() => setSelected(null)} />
          <div className={s.drawer}>
            <div className={s.drawerHead}>
              <h2 className={s.drawerTitle}>
                <FileText size={20} className={s.iconAmber} />
                Chi tiết đơn tuyển
              </h2>
              <button onClick={() => setSelected(null)} className={s.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <div className={clsx(s.drawerBody, "custom-scrollbar")}>
              <div className={s.profileCard}>
                <div className={s.avatarLg}>{selected.fullName.charAt(0)}</div>
                <div className={s.profileMain}>
                  <p className={s.profileName}>{selected.fullName}</p>
                  <p className={s.profileLine}>
                    <User size={12} /> {selected.email}
                  </p>
                  <p className={s.profileLine}>{selected.phone}</p>
                </div>
              </div>

              <div className={s.cardInner}>
                <p className={s.metaLabel}>Vị trí quan tâm</p>
                <p className={s.metaValue}>
                  <Briefcase size={16} className={s.iconAmber} /> {selected.job?.title}
                </p>
                <p className={s.metaSub}>{selected.job?.company}</p>
              </div>

              <div className={s.grid2}>
                {[
                  {
                    label: "Ngày sinh",
                    value: selected.dateOfBirth ? formatDate(selected.dateOfBirth) : "—",
                  },
                  { label: "Địa chỉ", value: selected.address || "—" },
                  { label: "Học vấn", value: selected.education || "—" },
                  { label: "Tiếng Anh", value: selected.languageLevel || "—" },
                ].map((item) => (
                  <div key={item.label} className={s.cardInner}>
                    <p className={s.metaLabel}>{item.label}</p>
                    <p className={s.metaValue}>{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.experience && (
                <div className={s.cardInner}>
                  <p className={s.metaLabel}>Kinh nghiệm</p>
                  <p>{selected.experience}</p>
                </div>
              )}

              {selected.coverLetter && (
                <div className={s.cardInner}>
                  <p className={s.metaLabel}>Thư giới thiệu</p>
                  <p className={s.preWrap}>{selected.coverLetter}</p>
                </div>
              )}

              <div className={s.noteBox}>
                <div>
                  <p className={s.noteTitle}>Ghi chú nội bộ</p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    className={s.noteInput}
                    placeholder="Ghi chú đánh giá ứng viên..."
                  />
                </div>
                <div>
                  <p className={s.noteTitle}>Cập nhật trạng thái</p>
                  <div className={s.statusBtns}>
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selected.id, status, adminNote || undefined)}
                        disabled={updatingId === selected.id}
                        className={clsx(
                          s.statusBtn,
                          selected.status === status &&
                            s.statusBtnActive &&
                            APP_STATUS_LABELS[status].color,
                        )}
                      >
                        {APP_STATUS_LABELS[status].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

<div className={s.drawerFoot}>
              <p className={s.footText}>Nộp lúc: {formatDate(selected.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="text-amber-600" size={20} />
                Thêm đơn ứng tuyển mới
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Họ tên *</label>
                  <input
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({...addForm, fullName: e.target.value})}
                    className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Email *</label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Điện thoại *</label>
                  <input
                    value={addForm.phone}
                    onChange={(e) => setAddForm({...addForm, phone: e.target.value})}
                    className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                    placeholder="0912 345 678"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Ngày sinh</label>
                  <input
                    type="date"
                    value={addForm.dateOfBirth}
                    onChange={(e) => setAddForm({...addForm, dateOfBirth: e.target.value})}
                    className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Vị trí ứng tuyển *</label>
                <select
                  value={addForm.jobId}
                  onChange={(e) => setAddForm({...addForm, jobId: e.target.value})}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none appearance-none"
                >
                  <option value="">-- Chọn vị trí --</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Địa chỉ</label>
                <input
                  value={addForm.address}
                  onChange={(e) => setAddForm({...addForm, address: e.target.value})}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                  placeholder="Địa chỉ hiện tại"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Học vấn</label>
                <input
                  value={addForm.education}
                  onChange={(e) => setAddForm({...addForm, education: e.target.value})}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                  placeholder="Tốt nghiệp ĐH..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Kinh nghiệm</label>
                <textarea
                  value={addForm.experience}
                  onChange={(e) => setAddForm({...addForm, experience: e.target.value})}
                  rows={2}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none resize-none"
                  placeholder="Mô tả kinh nghiệm làm việc..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Trình độ Tiếng Anh</label>
                <input
                  value={addForm.languageLevel}
                  onChange={(e) => setAddForm({...addForm, languageLevel: e.target.value})}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none"
                  placeholder="IELTS 5.5, PTE 50..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500">Thư giới thiệu</label>
                <textarea
                  value={addForm.coverLetter}
                  onChange={(e) => setAddForm({...addForm, coverLetter: e.target.value})}
                  rows={3}
                  className="w-full text-sm rounded-xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 outline-none resize-none"
                  placeholder="Giới thiệu ngắn về bản thân..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-12 rounded-2xl font-bold border border-slate-200 text-slate-600 hover:bg-white"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleAddApplication}
                disabled={saving}
                className="flex-[2] h-12 btn-primary font-bold shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {saving ? "Đang xử lý..." : "Thêm đơn ứng tuyển"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
