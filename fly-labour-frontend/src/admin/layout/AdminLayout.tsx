import { useState, useEffect, useRef } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Bell, X, Menu } from "lucide-react";
import AdminSidebar from "@/admin/layout/AdminSidebar";
import { useAuthStore } from "@core/store/authStore";
import { applicationsApi } from "@core/services/api";
import { APP_STATUS_LABELS, formatDate } from "@core/utils/helpers";
import type { Application } from "@core/types";
import clsx from "clsx";
import l from "./AdminLayout.module.scss";

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
    const interval = setInterval(loadNotifs, 60000);
    return () => clearInterval(interval);
  }, []);

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
    if (!notifOpen) setUnread(0);
  };

  return (
    <div className={l.shell}>
      <div className={l.sidebarDesk}>
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className={l.mobileBackdrop}>
          <div className={l.backdropDim} onClick={() => setSidebarOpen(false)} role="presentation" />
          <div className={l.mobileDrawer}>
            <AdminSidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className={l.mainCol}>
        <header className={l.header}>
          <div className={l.headerLeft}>
            <button type="button" onClick={() => setSidebarOpen(true)} className={l.menuBtn}>
              <Menu size={22} />
            </button>
            <p className={l.kicker}>Fly Labour — Hệ quản trị Admin</p>
          </div>

          <div className={l.headerRight}>
            <div ref={notifRef} className={l.notifWrap}>
              <button type="button" onClick={handleOpen} className={l.notifBellBtn}>
                <Bell size={18} />
                {unread > 0 && (
                  <span className={l.notifBadge}>{unread > 9 ? "9+" : unread}</span>
                )}
              </button>

              {notifOpen && (
                <div className={l.dropdown}>
                  <div className={l.dropdownHead}>
                    <div className={l.dropdownHeadLeft}>
                      <Bell size={15} className={l.iconGold} />
                      <span className={l.dropdownTitle}>Thông báo mới</span>
                    </div>
                    <button type="button" onClick={() => setNotifOpen(false)} className={l.closeIconBtn}>
                      <X size={16} />
                    </button>
                  </div>

                  <div className={clsx(l.dropdownList, "custom-scrollbar")}>
                    {loading ? (
                      <div className={l.loadingSkels}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className={l.skelLine} />
                        ))}
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className={l.emptyState}>
                        <p className={l.emptyEmoji}>📭</p>
                        <p className={l.muted}>Tất cả đã được xử lý!</p>
                      </div>
                    ) : (
                      <div className={l.notifList}>
                        {notifications.map((app) => (
                          <div key={app.id} className={l.notifRow}>
                            <div
                              className={l.avatarSm}
                              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                            >
                              {app.fullName.charAt(0)}
                            </div>
                            <div className={l.notifBody}>
                              <p className={l.notifName}>
                                <span className={l.nameAccent}>{app.fullName}</span> ứng tuyển vị trí mới
                              </p>
                              <p className={l.jobLine}>Job: {app.job?.title}</p>
                              <p className={l.dateLine}>{formatDate(app.createdAt)}</p>
                            </div>
                            <span className={APP_STATUS_LABELS[app.status]?.color}>
                              {APP_STATUS_LABELS[app.status]?.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={l.dropdownFoot}>
                    <a
                      href="/admin/applications"
                      className={l.footLink}
                      onClick={() => setNotifOpen(false)}
                    >
                      Xem tất cả đơn tuyển
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className={l.adminProfile}>
              <div className={l.profileText}>
                <p className={l.profileName}>{user?.fullName}</p>
                <p className={l.profileRole}>Super Admin</p>
              </div>
              <div
                className={l.profileAvatar}
                style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
              >
                {user?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className={clsx(l.pageMain, "custom-scrollbar")}>
          <div className={l.pageInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
