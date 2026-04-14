import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  Tag,
  Newspaper,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  X,
  CalendarDays,
  MessageSquare,
  Home,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/core/store/authStore";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Quản lý việc làm", icon: Briefcase, href: "/admin/jobs" },
  { label: "Đơn ứng tuyển", icon: ClipboardList, href: "/admin/applications" },
  { label: "Khách hàng", icon: Users, href: "/admin/users" },
  { label: "Danh mục", icon: Tag, href: "/admin/categories" },
  { label: "Tin tức", icon: Newspaper, href: "/admin/news" },
  { label: "Cẩm nang", icon: BookOpen, href: "/admin/handbook" },
  { label: "Điều khoản & Chính sách", icon: FileText, href: "/admin/policies" },
  { label: "Lịch công việc", icon: CalendarDays, href: "/admin/chores" },
  { label: "Liên hệ", icon: MessageSquare, href: "/admin/contacts" },
  { label: "Cài đặt", icon: Settings, href: "/admin/settings" },
];

interface Props {
  mobile?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ mobile, onClose }: Props) {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-brand-card border-r border-slate-200 dark:border-brand-border w-64 transition-colors duration-300">
      {/* Logo Section */}
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
              <span className="text-amber-600 dark:text-brand-gold">
                LABOUR
              </span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-brand-muted">
              Admin Control
            </p>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-brand-muted hover:text-red-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Admin Info Quick View */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-brand-gold/5 border border-slate-100 dark:border-brand-gold/10 rounded-2xl">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-900 font-bold text-sm shadow-sm shrink-0"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {user?.fullName?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 dark:text-white text-sm font-bold truncate">
              {user?.fullName}
            </p>
            <p className="text-amber-600 dark:text-brand-gold text-[10px] font-bold uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? "bg-amber-50 dark:bg-brand-gold/15 text-amber-700 dark:text-brand-gold border border-amber-100 dark:border-brand-gold/20 shadow-sm"
                  : "text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
            >
              <item.icon
                size={18}
                className={
                  isActive
                    ? "text-amber-600 dark:text-brand-gold"
                    : "text-slate-400 dark:text-brand-muted group-hover:text-slate-900 dark:group-hover:text-white"
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
      <div className="p-4 border-t border-slate-100 dark:border-brand-border space-y-1 bg-slate-50/50 dark:bg-black/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <Home size={18} /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
