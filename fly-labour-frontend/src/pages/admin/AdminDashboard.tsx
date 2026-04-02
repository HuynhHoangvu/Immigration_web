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
} from "recharts";
import { Users, Briefcase, ClipboardList, Eye, TrendingUp } from "lucide-react";
import { jobsApi, applicationsApi, usersApi } from "@/services/api";
import { APP_STATUS_LABELS, formatDate } from "@/utils/helpers";
import type { Application } from "@/types";

const PIE_COLORS = ["#fdd52f", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6"];

const MONTHLY_DATA = [
  { month: "T8", apps: 28, users: 65 },
  { month: "T9", apps: 42, users: 80 },
  { month: "T10", apps: 35, users: 72 },
  { month: "T11", apps: 61, users: 95 },
  { month: "T12", apps: 78, users: 110 },
  { month: "T1", apps: 89, users: 143 },
];

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
      label: "T?ng ngu?i dùng",
      value: userStats?.total ?? "—",
      sub: `+${userStats?.thisMonth ?? 0} tháng này`,
      icon: Users,
      color: "#fdd52f",
    },
    {
      label: "T?ng bài dang",
      value: jobStats?.totalJobs ?? "—",
      sub: `${jobStats?.activeJobs ?? 0} dang ho?t d?ng`,
      icon: Briefcase,
      color: "#e4a808",
    },
    {
      label: "Ðon ?ng tuy?n",
      value: totalApps || "—",
      sub: `${pendingCount} ch? xét duy?t`,
      icon: ClipboardList,
      color: "#06B6D4",
    },
    {
      label: "Lu?t xem t?ng",
      value: jobStats?.totalViews ?? "—",
      sub: "T?t c? bài dang",
      icon: Eye,
      color: "#8B5CF6",
    },
  ];

  const byCountry = [
    {
      name: "???? Úc",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "australia")
          ?.count || 0,
    },
    {
      name: "???? Canada",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "canada")?.count ||
        0,
    },
    {
      name: "???? NZ",
      value:
        jobStats?.byCountry?.find((c: any) => c.country === "new_zealand")
          ?.count || 0,
    },
  ];

  if (loading)
    return (
      <div className="space-y-7">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-brand-muted text-sm mt-0.5">Ðang t?i d? li?u...</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-brand-card rounded-2xl animate-pulse border border-brand-border"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-0.5">
          T?ng quan ho?t d?ng h? th?ng
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="card-dark p-5"
            style={{ background: `linear-gradient(135deg, #141414, #111)` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `${card.color}18`,
                  border: `1px solid ${card.color}30`,
                }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <TrendingUp size={13} className="text-green-400 mt-1" />
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-white font-medium mt-0.5">
              {card.label}
            </p>
            <p className="text-xs text-brand-muted mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card-dark p-5 lg:col-span-2">
          <h3 className="font-semibold text-white text-sm mb-5">
            Ðon ?ng tuy?n & Ngu?i dùng m?i theo tháng
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA} barGap={4}>
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B6B6B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6B6B6B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #2A2A2A",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="apps"
                name="Ðon ?ng tuy?n"
                fill="#fdd52f"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="users"
                name="Ngu?i dùng m?i"
                fill="#e4a808"
                radius={[6, 6, 0, 0]}
                opacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-dark p-5">
          <h3 className="font-semibold text-white text-sm mb-5">
            Vi?c làm theo qu?c gia
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={byCountry}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {byCountry.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#141414",
                  border: "1px solid #2A2A2A",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {byCountry.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  <span className="text-slate-900">{c.name}</span>
                </div>
                <span className="text-white font-semibold">{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status + Recent apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card-dark p-5">
          <h3 className="font-semibold text-white text-sm mb-4">
            Tr?ng thái don ?ng tuy?n
          </h3>
          <div className="space-y-3">
            {appStats.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between text-xs mb-1">
                  <span
                    className={`px-2 py-0.5 rounded-full border text-xs font-medium ${APP_STATUS_LABELS[item.status as keyof typeof APP_STATUS_LABELS]?.color}`}
                  >
                    {
                      APP_STATUS_LABELS[
                        item.status as keyof typeof APP_STATUS_LABELS
                      ]?.label
                    }
                  </span>
                  <span className="text-white font-semibold">{item.count}</span>
                </div>
                <div className="h-1.5 bg-brand-dark rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-orange"
                    style={{
                      width: `${totalApps ? (parseInt(item.count) / totalApps) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">
              Ðon ?ng tuy?n g?n dây
            </h3>
            <Link
              to="/admin/applications"
              className="text-xs text-brand-gold hover:text-brand-orange transition-colors"
            >
              Xem t?t c? ?
            </Link>
          </div>
          <div className="space-y-2">
            {recentApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 bg-brand-dark rounded-xl hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  }}
                >
                  {app.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {app.fullName}
                  </p>
                  <p className="text-brand-muted text-xs truncate">
                    {app.job?.title}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${APP_STATUS_LABELS[app.status]?.color}`}
                  >
                    {APP_STATUS_LABELS[app.status]?.label}
                  </span>
                  <p className="text-brand-muted text-xs mt-0.5">
                    {formatDate(app.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {recentApps.length === 0 && (
              <p className="text-center text-brand-muted text-sm py-8">
                Chua có don ?ng tuy?n nào
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
