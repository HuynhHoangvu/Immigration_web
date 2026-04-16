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
import { useAuthStore } from "@/core/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col h-full bg-white dark:bg-brand-card border-r border-slate-200 dark:border-brand-border w-64 transition-colors duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-brand-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            <span className="font-display text-sm text-amber-900 font-black">
              FL
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              FLY{" "}
              <span className="text-amber-500 dark:text-brand-gold">
                LABOUR
              </span>
            </p>
            <p className="text-xs font-bold uppercase tracking-tighter text-slate-400 dark:text-gray-300">
              Cổng Nhà tuyển dụng
            </p>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-300 hover:text-red-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User Quick Info */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-brand-gold/5 border border-slate-100 dark:border-brand-gold/10 rounded-2xl">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm shrink-0"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {user?.fullName?.charAt(0) || "E"}
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-white text-sm font-bold truncate">
              {user?.companyName || user?.fullName}
            </p>
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold uppercase tracking-wider">
              Nhà tuyển dụng
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/employer" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-amber-50 dark:bg-brand-gold/15 text-amber-700 dark:text-brand-gold border border-amber-100 dark:border-brand-gold/20 shadow-sm"
                  : "text-slate-500 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <item.icon
                size={18}
                className={
                  isActive
                    ? "text-amber-600 dark:text-brand-gold"
                    : "text-slate-400 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white"
                }
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight
                  size={14}
                  className="text-amber-600 dark:text-brand-gold"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-brand-border space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
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
    <div className="flex h-screen bg-slate-50 dark:bg-brand-dark overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Modal */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] md:hidden flex">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex-none h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-brand-border bg-white/80 dark:bg-brand-card/80 backdrop-blur-md shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Menu size={22} />
            </button>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-300 hidden sm:block">
              Fly Labour — Hệ quản trị Nhà tuyển dụng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-300 uppercase font-bold tracking-tighter">
                ID: #{user?.id?.slice(-5)}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm"
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
