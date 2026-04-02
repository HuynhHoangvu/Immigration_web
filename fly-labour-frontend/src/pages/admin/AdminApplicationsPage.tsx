import { useEffect, useState } from 'react'
import { Search, Eye, X, ChevronDown } from 'lucide-react'
import { MOCK_APPLICATIONS } from '@/utils/mockData'
import type { Application, AppStatus } from '@/types'
import { APP_STATUS_LABELS, formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'
import { applicationsApi } from '@/services/api'

const STATUS_OPTIONS: AppStatus[] = ['pending', 'reviewing', 'approved', 'rejected', 'withdrawn']

export default function AdminApplicationsPage() {
   const [apps, setApps] = useState<Application[]>([]);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState("");
   const [filterStatus, setFilterStatus] = useState<AppStatus | "">("");
   const [selected, setSelected] = useState<Application | null>(null);
   const [updatingId, setUpdatingId] = useState<string | null>(null);
   const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

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
           counts[i.status] = parseInt(i.count);
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

   const updateStatus = async (id: string, status: AppStatus) => {
     setUpdatingId(id);
     try {
       await applicationsApi.updateStatus(id, status);
       setApps((as) => as.map((a) => (a.id === id ? { ...a, status } : a)));
       if (selected?.id === id)
         setSelected((s) => (s ? { ...s, status } : null));
       toast.success("Ðã c?p nh?t tr?ng thái");
       // Refresh stats
       applicationsApi.getStats().then((r) => {
         const counts: Record<string, number> = {};
         r.data.forEach((i: any) => {
           counts[i.status] = parseInt(i.count);
         });
         setStatusCounts(counts);
       });
     } catch {
       toast.error("C?p nh?t th?t b?i");
     } finally {
       setUpdatingId(null);
     }
   };

   const totalAll = Object.values(statusCounts).reduce((s, v) => s + v, 0);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Ðon ?ng tuy?n</h1>
        <p className="text-brand-muted text-sm">
          {apps.length} don ·{" "}
          {apps.filter((a) => a.status === "pending").length} ch? xét duy?t
        </p>
      </div>

      {/* Filters */}
      <div className="card-dark p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark pl-9 py-2 text-sm h-10"
            placeholder="Tìm tên, email..."
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterStatus("")}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${!filterStatus ? "bg-brand-gold/15 border-brand-gold/30 text-brand-gold" : "border-brand-border text-brand-muted hover:text-white"}`}
          >
            T?t c? ({totalAll})
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterStatus === s ? APP_STATUS_LABELS[s].color : "border-brand-border text-brand-muted hover:text-white"}`}
            >
              {APP_STATUS_LABELS[s].label} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-dark/50">
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  ?ng viên
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">
                  V? trí ?ng tuy?n
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">
                  Ngày n?p
                </th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Tr?ng thái
                </th>
                <th className="text-right px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 text-xs font-bold shrink-0"
                        style={{
                          background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                        }}
                      >
                        {app.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {app.fullName}
                        </p>
                        <p className="text-brand-muted text-xs">{app.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="text-white text-sm line-clamp-1">
                      {app.job?.title}
                    </p>
                    <p className="text-brand-muted text-xs">
                      {app.job?.company}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-brand-muted text-xs">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateStatus(app.id, e.target.value as AppStatus)
                        }
                        disabled={updatingId === app.id}
                        className={`text-xs px-2 py-1 rounded-lg border font-medium bg-brand-dark cursor-pointer appearance-none pr-6 ${APP_STATUS_LABELS[app.status].color}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {APP_STATUS_LABELS[s].label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={10}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setSelected(app)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-brand-muted text-sm">
              Không có don nào
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md bg-brand-card border-l border-brand-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-border sticky top-0 bg-brand-card">
              <h2 className="font-semibold text-white">
                Chi ti?t don ?ng tuy?n
              </h2>
              <button onClick={() => setSelected(null)}>
                <X size={18} className="text-brand-muted hover:text-white" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Applicant info */}
              <div className="flex items-center gap-3 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 font-bold"
                  style={{
                    background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  }}
                >
                  {selected.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {selected.fullName}
                  </p>
                  <p className="text-brand-muted text-sm">{selected.email}</p>
                  <p className="text-brand-muted text-sm">{selected.phone}</p>
                </div>
              </div>

              {/* Job info */}
              <div className="p-4 bg-brand-dark rounded-xl">
                <p className="text-xs text-brand-muted mb-1">
                  V? trí ?ng tuy?n
                </p>
                <p className="text-white font-medium">{selected.job?.title}</p>
                <p className="text-brand-muted text-sm">
                  {selected.job?.company}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Ngày sinh",
                    value: selected.dateOfBirth
                      ? formatDate(selected.dateOfBirth)
                      : "—",
                  },
                  { label: "Ð?a ch?", value: selected.address || "—" },
                  { label: "H?c v?n", value: selected.education || "—" },
                  { label: "Ti?ng Anh", value: selected.languageLevel || "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-brand-dark rounded-xl"
                  >
                    <p className="text-xs text-brand-muted">{item.label}</p>
                    <p className="text-white text-sm mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.experience && (
                <div className="p-4 bg-brand-dark rounded-xl">
                  <p className="text-xs text-brand-muted mb-1">Kinh nghi?m</p>
                  <p className="text-white text-sm">{selected.experience}</p>
                </div>
              )}

              {selected.coverLetter && (
                <div className="p-4 bg-brand-dark rounded-xl">
                  <p className="text-xs text-brand-muted mb-1">Thu xin vi?c</p>
                  <p className="text-slate-900 text-sm leading-relaxed">
                    {selected.coverLetter}
                  </p>
                </div>
              )}

              {/* Change status */}
              <div className="p-4 bg-brand-dark rounded-xl">
                <p className="text-xs text-brand-muted mb-3">
                  C?p nh?t tr?ng thái
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                        selected.status === s
                          ? APP_STATUS_LABELS[s].color
                          : "border-brand-border text-brand-muted hover:text-white hover:border-white/20"
                      }`}
                    >
                      {APP_STATUS_LABELS[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-brand-muted text-center">
                Ngày n?p: {formatDate(selected.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
