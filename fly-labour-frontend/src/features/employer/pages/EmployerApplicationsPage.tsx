import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { employerApi, applicationsApi, getImageUrl } from "@core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import toast from "react-hot-toast";
import type { Application } from "@core/types";
import clsx from "clsx";
import s from "./EmployerApplicationsPage.module.scss";

// Cấu hình trạng thái với màu sắc linh hoạt cho cả 2 chế độ
const EMPLOYER_STATUS_OPTIONS = [
  {
    value: "reviewing",
    label: "Đang xem xét",
    icon: Clock,
    color:
      "text-blue-600 border-blue-200 bg-blue-50   ",
  },
  {
    value: "approved",
    label: "Phê duyệt",
    icon: CheckCircle,
    color:
      "text-green-600 border-green-200 bg-green-50   ",
  },
  {
    value: "rejected",
    label: "Từ chối",
    icon: XCircle,
    color:
      "text-red-600 border-red-200 bg-red-50   ",
  },
];

export default function EmployerApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    employerApi
      .getApplications()
      .then((r) => setApps(r.data || []))
      .catch(() => toast.error("Không tải được hồ sơ"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (appId: string, status: string) => {
    setUpdatingId(appId);
    try {
      const res = await applicationsApi.employerUpdateStatus(appId, status);
      setApps((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: res.data.status } : a,
        ),
      );
      toast.success("Đã cập nhật trạng thái");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = apps.filter(
    (a) =>
      !search ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className={s.page}>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>
            Hồ sơ ứng viên
          </h1>
          <p className={s.sub}>
            {apps.length} hồ sơ đã nhận
          </p>
        </div>
      </div>

      <div className={s.searchWrap}>
        <Search size={16} className={s.searchIcon} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email hoặc tên vị trí..."
          className={s.searchInput}
        />
      </div>

      {loading ? (
        <div className={s.skeletonList}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={clsx(s.skeleton, "animate-pulse")} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={s.empty}>
          <p className={s.emptyEmoji}>📂</p>
          <p className={s.emptyTitle}>
            {search ? "Không tìm thấy kết quả" : "Chưa có hồ sơ nào"}
          </p>
          <p className={clsx(s.emptySub, "fl-max-xs")}>
            Hồ sơ sẽ xuất hiện tại đây khi ứng viên nộp vào các tin tuyển dụng
            của bạn.
          </p>
        </div>
      ) : (
        <div className={s.list}>
          {filtered.map((app) => {
            const status = APP_STATUS_LABELS[app.status];
            const isOpen = expanded === app.id;
            return (
              <div
                key={app.id}
                className={clsx(s.appCard, isOpen && s.appCardOpen)}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className={s.rowBtn}
                >
                  <div
                    className={s.avatar}
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {app.fullName.charAt(0)}
                  </div>
                  <div className={s.main}>
                    <div className={s.nameRow}>
                      <p className={s.name}>
                        {app.fullName}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${status?.color}`}
                      >
                        {status?.label}
                      </span>
                    </div>
                    <p className={s.subline}>
                      {app.email} <span className="mx-1 opacity-50">•</span>{" "}
                      {app.job?.title}
                    </p>
                  </div>
                  <div className={s.right}>
                    <p className={s.date}>
                      {formatDate(app.createdAt)}
                    </p>
                    <div
                      className={clsx(s.chevWrap, isOpen && s.chevOpen)}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className={clsx(s.details, "fl-surface-muted-50")}>
                    <div className={s.metaGrid}>
                      {[
                        { label: "Điện thoại", value: app.phone },
                        {
                          label: "Ngày sinh",
                          value: app.dateOfBirth
                            ? formatDate(app.dateOfBirth)
                            : "—",
                        },
                        { label: "Địa chỉ", value: app.address || "—" },
                        { label: "Học vấn", value: app.education || "—" },
                        { label: "Kinh nghiệm", value: app.experience || "—" },
                        { label: "Tiếng Anh", value: app.languageLevel || "—" },
                      ].map((f) => (
                        <div
                          key={f.label}
                          className={s.metaCard}
                        >
                          <p className={s.metaLabel}>
                            {f.label}
                          </p>
                          <p className={s.metaValue}>
                            {f.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {app.coverLetter && (
                      <div className={s.cover}>
                        <p className={s.metaLabel}>
                          Thư xin việc
                        </p>
                        <p className={s.coverText}>
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className={s.actions}>
                      {app.cvUrl ? (
                        <div className={s.cvArea}>
                          <p className={s.cvLabel}>
                            Hồ sơ đính kèm
                          </p>
                          <a
                            href={getImageUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.cvBtn}
                          >
                            <FileText size={16} /> Xem CV chi tiết{" "}
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ) : (
                        <div className={s.cvArea} />
                      )}

                      {app.status !== "withdrawn" && (
                        <div className={s.statusArea}>
                          <p className={s.statusLabel}>
                            Cập nhật trạng thái hồ sơ
                          </p>
                          <div className={s.statusActions}>
                            {EMPLOYER_STATUS_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                disabled={
                                  app.status === opt.value ||
                                  updatingId === app.id
                                }
                                onClick={() =>
                                  handleStatusChange(app.id, opt.value)
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all disabled:opacity-50 shadow-sm ${
                                  app.status === opt.value
                                    ? opt.color
                                    : s.statusBtn
                                }`}
                              >
                                {updatingId === app.id &&
                                app.status !== opt.value ? (
                                  <div className={clsx(s.spinMini, "animate-spin")} />
                                ) : (
                                  <opt.icon size={14} />
                                )}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
