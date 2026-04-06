import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardList,
  Tag,
  Newspaper,
  Settings,
  LogOut,
  ChevronRight,
  X,
  CalendarDays,
  MessageSquare,
  Home,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Quản lý việc làm", icon: Briefcase, href: "/admin/jobs" },
  { label: "Đơn ứng tuyển", icon: ClipboardList, href: "/admin/applications" },
  { label: "Khách hàng", icon: Users, href: "/admin/users" },
  { label: "Danh mục", icon: Tag, href: "/admin/categories" },
  { label: "Tin tức", icon: Newspaper, href: "/admin/news" },
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
    // Dùng bg-theme-surface thay cho bg-brand-card
    <div className="flex flex-col h-full bg-theme-surface border-r border-theme-border-default w-60">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-theme-border-default">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            <span className="font-display text-sm text-slate-900 font-black">
              FL
            </span>
          </div>
          <div>
            <p className="font-display text-sm text-theme-text-base tracking-wider font-bold">
              FLY <span className="text-brand-gold-primary">LABOUR</span>
            </p>
            <p className="text-xs text-theme-text-tertiary -mt-0.5">
              Admin Panel
            </p>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="text-theme-text-tertiary hover:text-theme-text-base"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-theme-border-default">
        <div className="flex items-center gap-3 p-3 bg-brand-gold-primary/5 border border-brand-gold-primary/10 rounded-xl">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs shadow-sm"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {user?.fullName?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-theme-text-base text-sm font-semibold truncate">
              {user?.fullName}
            </p>
            <p className="text-brand-gold-primary font-medium text-xs">
              Quản trị viên
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group font-medium ${
                isActive
                  ? "bg-brand-gold-primary/10 text-brand-gold-primary border border-brand-gold-primary/20"
                  : "text-theme-text-secondary hover:text-theme-text-base hover:bg-theme-surfaceSecondary"
              }`}
            >
              <item.icon
                size={16}
                className={
                  isActive
                    ? "text-brand-gold-primary"
                    : "text-theme-text-tertiary group-hover:text-theme-text-base transition-colors"
                }
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight size={13} className="text-brand-gold-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-theme-border-default bg-theme-surfaceSecondary/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
        <Link
          to="/"
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-theme-text-secondary hover:text-theme-text-base hover:bg-theme-surfaceSecondary transition-colors"
        >
          <Home size={16} className="text-theme-text-tertiary" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
