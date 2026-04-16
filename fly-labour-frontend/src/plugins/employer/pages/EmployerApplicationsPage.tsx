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
import { employerApi, applicationsApi, getImageUrl } from "@/core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@/core/utils/helpers";
import toast from "react-hot-toast";
import type { Application } from "@/core/types";

// Cấu hình trạng thái với màu sắc linh hoạt cho cả 2 chế độ
const EMPLOYER_STATUS_OPTIONS = [
  {
    value: "reviewing",
    label: "Đang xem xét",
    icon: Clock,
    color:
      "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-400/30 dark:bg-blue-400/5",
  },
  {
    value: "approved",
    label: "Phê duyệt",
    icon: CheckCircle,
    color:
      "text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-400/30 dark:bg-green-400/5",
  },
  {
    value: "rejected",
    label: "Từ chối",
    icon: XCircle,
    color:
      "text-red-600 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-400/30 dark:bg-red-400/5",
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
    <div className="space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hồ sơ ứng viên
          </h1>
          <p className="text-slate-500 dark:text-gray-300 text-sm">
            {apps.length} hồ sơ đã nhận
          </p>
        </div>
      </div>

      {/* Search Bar - Chuyển sang style linh hoạt */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-300"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên, email hoặc tên vị trí..."
          className="w-full h-12 pl-11 pr-4 text-sm rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none shadow-sm dark:shadow-none transition-all"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white dark:bg-brand-card rounded-2xl animate-pulse border border-slate-200 dark:border-brand-border"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl p-16 text-center shadow-sm">
          <p className="text-5xl mb-4">📂</p>
          <p className="text-slate-900 dark:text-white font-semibold text-lg mb-1">
            {search ? "Không tìm thấy kết quả" : "Chưa có hồ sơ nào"}
          </p>
          <p className="text-slate-500 dark:text-gray-300 text-sm max-w-xs mx-auto">
            Hồ sơ sẽ xuất hiện tại đây khi ứng viên nộp vào các tin tuyển dụng
            của bạn.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const status = APP_STATUS_LABELS[app.status];
            const isOpen = expanded === app.id;
            return (
              <div
                key={app.id}
                className={`bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl overflow-hidden transition-all ${isOpen ? "ring-1 ring-brand-gold/30 shadow-lg" : "shadow-sm"}`}
              >
                {/* Main Row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shrink-0 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-slate-900 dark:text-white font-bold text-sm">
                        {app.fullName}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${status?.color}`}
                      >
                        {status?.label}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-gray-300 text-xs truncate font-medium">
                      {app.email} <span className="mx-1 opacity-50">•</span>{" "}
                      {app.job?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-slate-400 dark:text-gray-300 text-xs hidden md:block">
                      {formatDate(app.createdAt)}
                    </p>
                    <div
                      className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-600" : ""}`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-white/5 p-5 space-y-5 bg-slate-50/50 dark:bg-black/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          className="p-4 bg-white dark:bg-brand-card border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none"
                        >
                          <p className="text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">
                            {f.label}
                          </p>
                          <p className="text-slate-900 dark:text-white text-sm font-semibold">
                            {f.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {app.coverLetter && (
                      <div className="p-4 bg-white dark:bg-brand-card border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none">
                        <p className="text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">
                          Thư xin việc
                        </p>
                        <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                      {app.cvUrl ? (
                        <div className="flex-1">
                          <p className="text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">
                            Hồ sơ đính kèm
                          </p>
                          <a
                            href={getImageUrl(app.cvUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-brand-gold/10 text-amber-700 dark:text-brand-gold text-sm font-bold border border-amber-200 dark:border-brand-gold/30 hover:bg-amber-100 dark:hover:bg-brand-gold/20 transition-all"
                          >
                            <FileText size={16} /> Xem CV chi tiết{" "}
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}

                      {/* Status actions */}
                      {app.status !== "withdrawn" && (
                        <div className="shrink-0">
                          <p className="text-slate-400 dark:text-gray-300 text-xs font-bold uppercase tracking-widest mb-3 sm:text-right">
                            Cập nhật trạng thái hồ sơ
                          </p>
                          <div className="flex flex-wrap gap-2">
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
                                    : "bg-white dark:bg-brand-card border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:border-amber-400 dark:hover:border-brand-gold hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                {updatingId === app.id &&
                                app.status !== opt.value ? (
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
