import { useState, useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Bell, X, CheckCheck } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuthStore } from "@/store/authStore";
import { applicationsApi } from "@/services/api";
import { APP_STATUS_LABELS, formatDate } from "@/utils/helpers";
import type { Application } from "@/types";

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Application[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Load don pending m?i nh?t làm thông báo
  const loadNotifs = () => {
    setLoading(true);
    applicationsApi
      .getAll({ status: "pending", limit: 10 })
      .then((r) => {
        setNotifications(r.data.data);
        setUnread(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifs();
    // T? refresh m?i 60 giây
    const interval = setInterval(loadNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ðóng khi click ra ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen) setUnread(0); // dánh d?u dã d?c khi m?
  };

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex-none">
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-brand-border bg-brand-card/80 backdrop-blur shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-900 hover:text-white"
          >
            ?
          </button>
          <div className="flex-1 hidden md:block">
            <p className="text-xs text-brand-muted">
              Fly Labour · Admin Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell button */}
            <div ref={notifRef} className="relative">
              <button
                onClick={handleOpen}
                className="relative w-9 h-9 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-muted hover:text-white hover:border-brand-gold/40 transition-colors"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {/* Dropdown thông báo */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-brand-card border border-brand-border rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-brand-gold" />
                      <span className="font-semibold text-white text-sm">
                        Thông báo
                      </span>
                      {notifications.length > 0 && (
                        <span className="bg-brand-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {notifications.length}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-brand-muted hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="space-y-2 p-3">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-14 bg-brand-dark rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-3xl mb-2">??</p>
                        <p className="text-brand-muted text-sm">
                          Không có thông báo m?i
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {notifications.map((app) => (
                          <div
                            key={app.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            {/* Avatar */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 text-xs font-bold shrink-0 mt-0.5"
                              style={{
                                background:
                                  "linear-gradient(135deg,#e4a808,#fdd52f)",
                              }}
                            >
                              {app.fullName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium">
                                <span className="text-brand-gold">
                                  {app.fullName}
                                </span>{" "}
                                v?a ?ng tuy?n
                              </p>
                              <p className="text-brand-muted text-xs truncate mt-0.5">
                                {app.job?.title}
                              </p>
                              <p className="text-brand-muted text-[10px] mt-1">
                                {formatDate(app.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${APP_STATUS_LABELS[app.status]?.color}`}
                            >
                              {APP_STATUS_LABELS[app.status]?.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-brand-border p-2">
                    <a
                      href="/admin/applications"
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs text-brand-gold hover:bg-brand-gold/10 transition-colors font-medium"
                      onClick={() => setNotifOpen(false)}
                    >
                      Xem t?t c? don ?ng tuy?n ?
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xs"
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
