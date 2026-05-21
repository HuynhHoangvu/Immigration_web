import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  ChevronDown,
  User,
  BookOpen,
} from "lucide-react";
import type { StudyApplication, AppStatus } from "@core/types";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import { studyApplicationsApi } from "@core/services/api";
import clsx from "clsx";
import s from "./AdminStudyApplicationsPage.module.scss";

const STATUS_OPTIONS: AppStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "withdrawn",
];

// Country list for study abroad
const COUNTRIES = [
  "Mỹ", "Anh", "Úc", "Canada", "Đức", "Pháp", "Nhật", "Hàn", "Singapore", "New Zealand", "Ireland", "Hà Lan"
];

export default function AdminStudyApplicationsPage() {
  const [apps, setApps] = useState<StudyApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "">("");
  const [selected, setSelected] = useState<StudyApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [adminNote, setAdminNote] = useState("");

  const loadApps = () => {
    setLoading(true);
    studyApplicationsApi
      .getAll({ status: filterStatus || undefined, limit: 50 })
      .then((r) => {
        setApps(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    studyApplicationsApi
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
      await studyApplicationsApi.updateStatus(id, status, note);
      setApps((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
      if (selected?.id === id) setSelected((old) => (old ? { ...old, status } : null));
      toast.success("Đã cập nhật trạng thái");
      studyApplicationsApi.getStats().then((r) => {
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

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>
            <BookOpen className={s.titleIcon} />
            Đơn Du học
          </h1>
          <p className={s.sub}>
            Tổng {total} đơn ·{" "}
            <span className={s.subAccent}>{statusCounts.pending || 0} đang chờ duyệt</span>
          </p>
        </div>
      </div>

      <div className={clsx(s.card, s.filterBar)}>
        <div className={s.searchWrap}>
          <Search size={16} className={s.searchIcon} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={s.searchInput}
            placeholder="Tìm theo tên, email..."
          />
        </div>
        <div className={s.chipRow}>
          <button
            onClick={() => setFilterStatus("")}
            className={clsx(s.chip, !filterStatus ? s.chipActiveAll : "")}
          >
            Tất cả ({totalAll})
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={clsx(
                s.chip,
                filterStatus === status && APP_STATUS_LABELS[status].color,
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
                <th className={clsx(s.th, s.thSm)}>Quốc gia</th>
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
                        <p className={s.jobTitle}>{app.targetCountry || "—"}</p>
                        <p className={s.jobCompany}>{app.university || app.major || "—"}</p>
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
              <p className={s.emptyText}>Không tìm thấy đơn du học nào</p>
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
                <BookOpen size={20} className={s.iconAmber} />
                Chi tiết đơn du học
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

              <div className={s.grid2}>
                {[
                  { label: "Quốc gia", value: selected.targetCountry || "—" },
                  { label: "Đại học", value: selected.university || "—" },
                  { label: "Ngành học", value: selected.major || "—" },
                  { label: "Bằng cấp", value: selected.degreeLevel || "—" },
                ].map((item) => (
                  <div key={item.label} className={s.cardInner}>
                    <p className={s.metaLabel}>{item.label}</p>
                    <p className={s.metaValue}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className={s.grid2}>
                {[
                  { label: "Ngày nhập học", value: selected.intake || "—" },
                  { label: "Ngân sách", value: selected.budget || "—" },
                  { label: "Ngày sinh", value: selected.dateOfBirth ? formatDate(selected.dateOfBirth) : "—" },
                  { label: "Địa chỉ", value: selected.address || "—" },
                ].map((item) => (
                  <div key={item.label} className={s.cardInner}>
                    <p className={s.metaLabel}>{item.label}</p>
                    <p className={s.metaValue}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className={s.cardInner}>
                <p className={s.metaLabel}>Học vấn</p>
                <p className={s.metaValue}>{selected.education || "—"}</p>
              </div>

              <div className={s.cardInner}>
                <p className={s.metaLabel}>Trình độ Tiếng Anh</p>
                <p className={s.metaValue}>{selected.languageLevel || "—"}</p>
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
    </div>
  );
}
