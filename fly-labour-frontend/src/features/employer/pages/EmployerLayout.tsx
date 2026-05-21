import { useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  LogOut,
  X,
  Home,
  ChevronRight,
  UserCircle,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@core/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import s from "./EmployerLayout.module.scss";

const NAV = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/employer" },
  { label: "Tin tuyển dụng", icon: Briefcase, href: "/employer/jobs" },
  {
    label: "Hồ sơ ứng viên",
    icon: ClipboardList,
    href: "/employer/applications",
  },
  { label: "Hồ sơ công ty", icon: UserCircle, href: "/employer/profile" },
];

function Sidebar({
  mobile,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  return (
    <div className={s.sidebarRoot}>
      <div className={s.sidebarHeader}>
        <Link to="/" className={s.brandLink}>
          <div
            className={s.brandMark}
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            <span className={s.brandMarkText}>FL</span>
          </div>
          <div>
            <p className={s.brandName}>
              FLY <span className={s.brandAccent}>LABOUR</span>
            </p>
            <p className={s.brandSub}>
              Cổng Nhà tuyển dụng
            </p>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className={s.closeBtn}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className={s.userQuick}>
        <div className={s.userQuickInner}>
          <div
            className={s.userInitial}
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {user?.fullName?.charAt(0) || "E"}
          </div>
          <div>
            <p className={s.userName}>
              {user?.companyName || user?.fullName}
            </p>
            <p className={s.userRole}>
              Nhà tuyển dụng
            </p>
          </div>
        </div>
      </div>

      <nav className={clsx(s.nav, "custom-scrollbar")}>
        {NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/employer" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={clsx(
                s.navItem,
                isActive ? s.navItemActive : s.navItemIdle,
              )}
            >
              <item.icon
                size={18}
                className={isActive ? s.navIconActive : s.navIconIdle}
              />
              <span className={s.navLabel}>{item.label}</span>
              {isActive && (
                <ChevronRight size={14} className={s.navChevron} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={s.sidebarFooter}>
        <button
          onClick={handleLogout}
          className={clsx(s.footerBtn, s.logoutBtn)}
        >
          <LogOut size={18} /> Đăng xuất
        </button>
        <Link
          to="/"
          className={clsx(s.footerBtn, s.homeBtn)}
        >
          <Home size={18} /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function EmployerLayout() {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (
    !isAuthenticated ||
    (user?.role !== "employer" && user?.role !== "admin")
  ) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`${s.layout} fl-surface-page`}>
      <div className={s.desktopSidebar}>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className={clsx(s.mobileModal, "md:hidden")}>
          <div
            className={s.mobileBackdrop}
            onClick={() => setSidebarOpen(false)}
          />
          <div className={clsx(s.mobilePanel, "animate-in slide-in-from-left duration-300")}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className={s.mainWrap}>
        <header className={s.header}>
          <div className={s.headerLeft}>
            <button
              onClick={() => setSidebarOpen(true)}
              className={s.menuBtn}
            >
              <Menu size={22} />
            </button>
            <p className={s.headerTag}>
              Fly Labour — Hệ quản trị Nhà tuyển dụng
            </p>
          </div>

          <div className={s.headerRight}>
            <div className={s.headerMeta}>
              <p className={s.headerName}>
                {user?.fullName}
              </p>
              <p className={s.headerId}>
                ID: #{user?.id?.slice(-5)}
              </p>
            </div>
            <div
              className={s.headerInitial}
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        <main className={clsx(s.main, "custom-scrollbar")}>
          <div className="fl-max-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
