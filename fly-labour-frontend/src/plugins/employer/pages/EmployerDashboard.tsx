import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Eye,
  TrendingUp,
  ArrowRight,
  Clock,
  UserCircle,
} from "lucide-react";
import { employerApi } from "@/core/services/api";
import { useAuthStore } from "@/core/store/authStore";
import { formatDate, getCountryLabels } from "@/core/utils/helpers";
import type { Job, Application } from "@/core/types";

const JOB_STATUS_VI: Record<string, { label: string; color: string }> = {
  active: { label: "Đang tuyển", color: "text-green-600 dark:text-green-400" },
  draft: { label: "Nháp", color: "text-amber-600 dark:text-yellow-400" },
  paused: { label: "Tạm dừng", color: "text-slate-500 dark:text-slate-400" },
  closed: { label: "Đã đóng", color: "text-red-600 dark:text-red-400" },
};

export default function EmployerDashboard() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([employerApi.getMyJobs(), employerApi.getApplications()])
      .then(([jobsRes, appsRes]) => {
        setJobs(jobsRes.data.data || []);
        setApplications(appsRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0);
  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const recentApps = applications.slice(0, 5);
  const hasProfile = !!(user?.companyName && user?.companyDescription);

  // Class dùng chung
  const cardClasses =
    "bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl shadow-sm dark:shadow-none transition-colors";
  const innerItemClasses =
    "bg-slate-50 dark:bg-[#1e1e1e] border border-slate-100 dark:border-white/5 rounded-xl transition-colors";

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Xin chào, {user?.companyName || user?.fullName} 👋
        </h1>
        <p className="text-slate-500 dark:text-gray-300 text-sm mt-1">
          Tổng quan hoạt động tuyển dụng của doanh nghiệp bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Tin đang đăng",
            value: loading
              ? "—"
              : jobs.filter((j) => j.status === "active").length,
            icon: Briefcase,
            color: "#d97706", // Amber 600 cho Light
            darkColor: "#fdd52f",
          },
          {
            label: "Tổng hồ sơ",
            value: loading ? "—" : applications.length,
            icon: ClipboardList,
            color: "#2563eb",
            darkColor: "#3B82F6",
          },
          {
            label: "Chờ xét duyệt",
            value: loading ? "—" : pendingApps,
            icon: Clock,
            color: "#ea580c",
            darkColor: "#F59E0B",
          },
          {
            label: "Lượt xem",
            value: loading ? "—" : totalViews,
            icon: Eye,
            color: "#7c3aed",
            darkColor: "#8B5CF6",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${cardClasses} p-5 flex items-center gap-4`}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: `${s.color}15` }}
            >
              <s.icon
                size={20}
                className="dark:hidden"
                style={{ color: s.color }}
              />
              <s.icon
                size={20}
                className="hidden dark:block"
                style={{ color: s.darkColor }}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1">
                {s.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-300">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Jobs Section */}
        <div className={`${cardClasses} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Tin tuyển dụng
            </h2>
            <Link
              to="/employer/jobs"
              className="text-xs font-bold text-amber-600 dark:text-brand-gold hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-transparent rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-slate-500 dark:text-gray-300 text-sm mb-4">
                Chưa có tin tuyển dụng nào
              </p>
              <Link
                to="/employer/jobs"
                className="btn-primary text-sm px-6 py-2.5 inline-block font-medium"
              >
                Đăng tin đầu tiên
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => {
                const st = JOB_STATUS_VI[job.status] || {
                  label: job.status,
                  color: "text-slate-400",
                };
                return (
                  <div
                    key={job.id}
                    className={`${innerItemClasses} p-4 flex items-center justify-between group hover:border-amber-200 dark:hover:border-brand-gold/30 transition-all`}
                  >
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-semibold truncate mb-1">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-300">
                        <span>{getCountryLabels()[job.country]}</span>
                        <span>•</span>
                        <span>{job.slots || 0} chỉ tiêu</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Eye size={10} /> {job.viewCount || 0}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white dark:bg-black/20 border border-slate-200 dark:border-transparent shadow-sm ${st.color}`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Applications Section */}
        <div className={`${cardClasses} p-6`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Hồ sơ mới nhận
            </h2>
            <Link
              to="/employer/applications"
              className="text-xs font-bold text-amber-600 dark:text-brand-gold hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-transparent rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-slate-500 dark:text-gray-300 text-sm">
                Chưa có hồ sơ nào
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className={`${innerItemClasses} p-4 flex items-center gap-4 group hover:border-amber-200 dark:hover:border-brand-gold/30 transition-all`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shrink-0 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {app.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                      {app.fullName}
                    </p>
                    <p className="text-slate-500 dark:text-gray-300 text-xs truncate mt-0.5">
                      Ứng tuyển: {app.job?.title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-slate-400 dark:text-gray-300 text-xs font-medium">
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile completion tip */}
      {!hasProfile && (
        <div className="bg-amber-50 dark:bg-brand-gold/5 border border-amber-200 dark:border-brand-gold/20 rounded-2xl p-5 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white dark:bg-brand-gold/10 rounded-xl shadow-sm">
              <TrendingUp
                size={24}
                className="text-amber-600 dark:text-brand-gold"
              />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 dark:text-white font-bold text-sm">
                Hoàn thiện hồ sơ công ty ngay
              </p>
              <p className="text-slate-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">
                Thêm mô tả chi tiết và hình ảnh doanh nghiệp để tăng 40% tỷ lệ
                ứng tuyển từ các ứng viên chất lượng cao.
              </p>
            </div>
            <Link
              to="/employer/profile"
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-brand-gold text-amber-700 dark:text-amber-900 text-xs font-bold rounded-xl border border-amber-200 dark:border-transparent hover:bg-amber-100 transition-all shadow-sm"
            >
              <UserCircle size={14} /> Cập nhật
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
