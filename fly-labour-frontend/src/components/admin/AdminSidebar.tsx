import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Qu?n l� vi?c l�m", icon: Briefcase, href: "/admin/jobs" },
  { label: "�on ?ng tuy?n", icon: ClipboardList, href: "/admin/applications" },
  { label: "Kh�ch h�ng", icon: Users, href: "/admin/users" },
  { label: "Danh m?c", icon: Tag, href: "/admin/categories" },
  { label: "Tin t?c", icon: Newspaper, href: "/admin/news" },
  { label: "L?ch c�ng vi?c", icon: CalendarDays, href: "/admin/chores" },
  { label: "Li�n h?", icon: MessageSquare, href: "/admin/contacts" },
  { label: "C�i d?t", icon: Settings, href: "/admin/settings" },
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
    toast.success("�� dang xu?t");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full bg-brand-card border-r border-brand-border w-60">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-brand-border">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            <span className="font-display text-sm text-slate-900 font-black">
              FL
            </span>
          </div>
          <div>
            <p className="font-display text-sm text-white tracking-wider">
              FLY <span style={{ color: "#fdd52f" }}>LABOUR</span>
            </p>
            <p className="text-xs text-brand-muted -mt-0.5">Admin Panel</p>
          </div>
        </Link>
        {mobile && (
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-brand-border">
        <div className="flex items-center gap-3 p-3 bg-brand-gold/5 rounded-xl">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs"
            style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
          >
            {user?.fullName?.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.fullName}
            </p>
            <p className="text-brand-gold text-xs">Qu?n tr? vi�n</p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/20"
                  : "text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5"
              }`}
            >
              <item.icon
                size={16}
                className={
                  isActive
                    ? "text-brand-gold"
                    : "text-brand-muted group-hover:text-white"
                }
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight size={13} className="text-brand-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-brand-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          �ang xu?t
        </button>
        <Link
          to="/"
          className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          ? V? trang ch?
        </Link>
      </div>
    </div>
  );
}
