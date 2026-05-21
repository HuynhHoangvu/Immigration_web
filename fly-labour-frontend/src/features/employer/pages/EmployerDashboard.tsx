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
import { employerApi } from "@core/services/api";
import { useAuthStore } from "@core/store/authStore";
import { formatDate, getCountryLabels } from "@core/utils/helpers";
import type { Job, Application } from "@core/types";
import clsx from "clsx";
import s from "./EmployerDashboard.module.scss";

const JOB_STATUS_VI: Record<string, { label: string; color: string }> = {
  active: { label: "Đang tuyển", color: "text-green-600 " },
  draft: { label: "Nháp", color: "text-amber-600 " },
  paused: { label: "Tạm dừng", color: "text-slate-500 " },
  closed: { label: "Đã đóng", color: "text-red-600 " },
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

  const cardClasses = s.card;
  const innerItemClasses = s.item;

  return (
    <div className={s.page}>
      <div>
        <h1 className={s.headTitle}>
          Xin chào, {user?.companyName || user?.fullName} 👋
        </h1>
        <p className={s.headSub}>
          Tổng quan hoạt động tuyển dụng của doanh nghiệp bạn.
        </p>
      </div>

      <div className={s.statsGrid}>
        {[
          {
            label: "Tin đang đăng",
            value: loading
              ? "—"
              : jobs.filter((j) => j.status === "active").length,
            icon: Briefcase,
            color: "#d97706",
          },
          {
            label: "Tổng hồ sơ",
            value: loading ? "—" : applications.length,
            icon: ClipboardList,
            color: "#2563eb",
          },
          {
            label: "Chờ xét duyệt",
            value: loading ? "—" : pendingApps,
            icon: Clock,
            color: "#ea580c",
          },
          {
            label: "Lượt xem",
            value: loading ? "—" : totalViews,
            icon: Eye,
            color: "#7c3aed",
          },
        ].map((stat) => (
          <div key={stat.label} className={`${cardClasses} ${s.statCard}`}>
            <div
              className={s.statIconWrap}
              style={{ background: `${stat.color}15` }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <p className={s.statValue}>
                {stat.value}
              </p>
              <p className={s.statLabel}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={s.twoCol}>
        <div className={`${cardClasses} ${s.panel}`}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>
              Tin tuyển dụng
            </h2>
            <Link
              to="/employer/jobs"
              className={s.panelLink}
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className={s.list}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={clsx(s.skeleton, "animate-pulse")} />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className={s.empty}>
              <p className={s.emptyText}>
                Chưa có tin tuyển dụng nào
              </p>
              <Link
                to="/employer/jobs"
                className={clsx("btn-primary", s.emptyBtn)}
              >
                Đăng tin đầu tiên
              </Link>
            </div>
          ) : (
            <div className={s.list}>
              {jobs.slice(0, 5).map((job) => {
                const st = JOB_STATUS_VI[job.status] || {
                  label: job.status,
                  color: "text-slate-400",
                };
                return (
                  <div
                    key={job.id}
                    className={innerItemClasses}
                  >
                    <div className={s.itemMain}>
                      <p className={s.itemTitle}>
                        {job.title}
                      </p>
                      <div className={s.itemSub}>
                        <span>{getCountryLabels()[job.country]}</span>
                        <span>•</span>
                        <span>{job.slots || 0} chỉ tiêu</span>
                        <span>•</span>
                        <span className={s.itemSub}>
                          <Eye size={10} /> {job.viewCount || 0}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`${s.itemStatus} ${st.color}`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${cardClasses} ${s.panel}`}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>
              Hồ sơ mới nhận
            </h2>
            <Link
              to="/employer/applications"
              className={s.panelLink}
            >
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className={s.list}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={clsx(s.skeleton, "animate-pulse")} />
              ))}
            </div>
          ) : recentApps.length === 0 ? (
            <div className={s.empty}>
              <p className={s.emptyText}>
                Chưa có hồ sơ nào
              </p>
            </div>
          ) : (
            <div className={s.list}>
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className={innerItemClasses}
                >
                  <div
                    className={s.appAvatar}
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {app.fullName.charAt(0)}
                  </div>
                  <div className={s.appMain}>
                    <p className={s.appTitle}>
                      {app.fullName}
                    </p>
                    <p className={s.appSub}>
                      Ứng tuyển: {app.job?.title}
                    </p>
                  </div>
                  <div>
                    <p className={s.appDate}>
                      {formatDate(app.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hasProfile && (
        <div className={s.tip}>
          <div className={s.tipInner}>
            <div className={s.tipIconWrap}>
              <TrendingUp size={24} className={s.tipIcon} />
            </div>
            <div className={s.tipMain}>
              <p className={s.tipTitle}>
                Hoàn thiện hồ sơ công ty ngay
              </p>
              <p className={s.tipText}>
                Thêm mô tả chi tiết và hình ảnh doanh nghiệp để tăng 40% tỷ lệ
                ứng tuyển từ các ứng viên chất lượng cao.
              </p>
            </div>
            <Link
              to="/employer/profile"
              className={s.tipBtn}
            >
              <UserCircle size={14} /> Cập nhật
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
