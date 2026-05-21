import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Users, Briefcase, ClipboardList, Eye, TrendingUp } from "lucide-react";
import { jobsApi, applicationsApi, usersApi } from "@core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import type { Application } from "@core/types";
import clsx from "clsx";
import s from "./AdminDashboard.module.scss";

const PIE_COLORS = ["#fdd52f", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];
const MONTHLY_DATA = [
  { month: "T8", apps: 28, users: 65 },
  { month: "T9", apps: 42, users: 80 },
  { month: "T10", apps: 35, users: 72 },
  { month: "T11", apps: 61, users: 95 },
  { month: "T12", apps: 78, users: 110 },
  { month: "T1", apps: 89, users: 143 },
];

const STATUS_CHIP_CLASS: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  reviewing: "text-blue-600 bg-blue-50 border-blue-200",
  approved: "text-green-600 bg-green-50 border-green-200",
  rejected: "text-red-600 bg-red-50 border-red-200",
  withdrawn: "text-slate-500 bg-slate-50 border-slate-200",
};

export default function AdminDashboard() {
  const [jobStats, setJobStats] = useState<any>(null);
  const [appStats, setAppStats] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      jobsApi.getStats(),
      applicationsApi.getStats(),
      usersApi.getStats(),
      applicationsApi.getAll({ limit: 5 }),
    ])
      .then(([jobs, apps, users, recent]) => {
        setJobStats(jobs.data);
        setAppStats(apps.data);
        setUserStats(users.data);
        setRecentApps(recent.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApps = appStats.reduce((s, i) => s + parseInt(i.count), 0);
  const pendingCount = appStats.find((i) => i.status === "pending")?.count || 0;

  const STAT_CARDS = [
    {
      label: "Tổng người dùng",
      value: userStats?.total ?? "—",
      sub: `+${userStats?.thisMonth ?? 0} tháng này`,
      icon: Users,
      color: "#d97706", // Amber 600
    },
    {
      label: "Tổng bài đăng",
      value: jobStats?.totalJobs ?? "—",
      sub: `${jobStats?.activeJobs ?? 0} đang hoạt động`,
      icon: Briefcase,
      color: "#2563eb", // Blue 600
    },
    {
      label: "Đơn ứng tuyển",
      value: totalApps || "—",
      sub: `${pendingCount} chờ xét duyệt`,
      icon: ClipboardList,
      color: "#0891b2", // Cyan 600
    },
    {
      label: "Lượt xem tổng",
      value: jobStats?.totalViews ?? "—",
      sub: "Tất cả bài đăng",
      icon: Eye,
      color: "#7c3aed", // Violet 600
    },
  ];

  const byCountry = [
    {
      name: "🇦🇺 Úc",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "australia")
          ?.count || 0,
    },
    {
      name: "🇨🇦 Canada",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "canada")?.count ||
        0,
    },
    {
      name: "🇳🇿 NZ",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "new_zealand")
          ?.count || 0,
    },
  ];

  const chartTickColor = "#64748b";

  if (loading)
    return (
      <div className={clsx(s.skeletonPage, "animate-pulse")}>
        <div className={s.skeletonTitle} />
        <div className={s.statGridSkel}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={s.skeletonCard} />
          ))}
        </div>
      </div>
    );

  return (
    <div className={s.page}>
      <div>
        <h1 className={s.heading}>
          Dashboard
        </h1>
        <p className={s.subtitle}>
          Hệ thống ghi nhận{" "}
          <span className={s.subtitleAccent}>
            {totalApps}
          </span>{" "}
          đơn ứng tuyển mới
        </p>
      </div>

      <div className={s.statGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={s.statCard}>
            <div className={s.statTop}>
              <div
                className={s.iconBubble}
                style={{ background: `${card.color}15` }}
              >
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <div className={s.trendWrap}>
                <TrendingUp size={14} className={s.trendIco} />
              </div>
            </div>
            <p className={s.statValue}>
              {card.value}
            </p>
            <p className={s.statLabel}>
              {card.label}
            </p>
            <p className={s.statSub}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className={s.chartRow}>
        <div className={s.chartBarPanel}>
          <div className={s.chartHead}>
            <h3 className={s.chartTitle}>
              Tăng trưởng ứng tuyển & Người dùng
            </h3>
            <span className={s.badgePill}>
              6 tháng gần nhất
            </span>
          </div>
          <div className={s.chartHeight}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MONTHLY_DATA}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: chartTickColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chartTickColor, fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f5f5f3" }}
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="apps"
                  name="Đơn ứng tuyển"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="users"
                  name="Người dùng"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={s.piePanel}>
          <h3 className={s.pieTitle}>
            Thị trường chính
          </h3>
          <p className={s.pieDesc}>
            Phân bổ việc làm theo quốc gia
          </p>
          <div className={s.pieCenter}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={byCountry}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {byCountry.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={s.pieLegend}>
            {byCountry.map((c, i) => (
              <div key={c.name} className={s.legendRow}>
                <div className={s.legendLeft}>
                  <div
                    className={s.legendDot}
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className={s.legendName}>
                    {c.name}
                  </span>
                </div>
                <span className={s.legendVal}>
                  {c.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s.bottomGrid}>
        <div className={s.panel}>
          <h3 className={s.panelTitle}>
            Quy trình tuyển dụng
          </h3>
          <div className={s.pipelineStack}>
            {appStats.map((item) => (
              <div key={item.status}>
                <div className={s.pipelineRowHead}>
                  <span
                    className={clsx(
                      s.statusChipRow,
                      STATUS_CHIP_CLASS[item.status] || STATUS_CHIP_CLASS.withdrawn,
                    )}
                  >
                    {
                      APP_STATUS_LABELS[
                        item.status as keyof typeof APP_STATUS_LABELS
                      ]?.label
                    }
                  </span>
                  <span className={s.countBadge}>
                    {item.count}
                  </span>
                </div>
                <div className={s.barTrack}>
                  <div
                    className={s.barFill}
                    style={{
                      width: `${totalApps ? (parseInt(item.count) / totalApps) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.panelWide}>
          <div className={s.panelHeadRow}>
            <h3 className={s.panelTitleTight}>
              Đơn ứng tuyển mới nhất
            </h3>
            <Link
              to="/admin/applications"
              className={s.linkDash}
            >
              Quản lý tất cả →
            </Link>
          </div>
          <div className={s.appList}>
            {recentApps.map((app) => (
              <div key={app.id} className={s.appRow}>
                <div className={s.appAvatar}>
                  {app.fullName.charAt(0)}
                </div>
                <div className={s.appBody}>
                  <p className={s.appName}>
                    {app.fullName}
                  </p>
                  <p className={s.appJobLine}>
                    Ứng tuyển:{" "}
                    <span className={s.appJobTitle}>
                      {app.job?.title}
                    </span>
                  </p>
                </div>
                <div className={s.appAside}>
                  <span
                    className={clsx(
                      s.statusChipRow,
                      STATUS_CHIP_CLASS[app.status] || STATUS_CHIP_CLASS.withdrawn,
                    )}
                  >
                    {APP_STATUS_LABELS[app.status]?.label}
                  </span>
                  <p className={s.dateMeta}>
                    {formatDate(app.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {recentApps.length === 0 && (
              <div className={s.emptyBox}>
                <p className={s.emptyText}>
                  Chưa có đơn ứng tuyển nào được ghi nhận
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
