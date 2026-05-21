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
  GraduationCap,
  Plane,
} from "lucide-react";
import { useAuthStore } from "@core/store/authStore";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./AdminSidebar.module.scss";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Quản lý việc làm", icon: Briefcase, href: "/admin/jobs" },
  { label: "Đơn ứng tuyển", icon: ClipboardList, href: "/admin/applications" },
  { label: "Đơn du học", icon: GraduationCap, href: "/admin/study-programs" },
  { label: "Tin tức du học", icon: Newspaper, href: "/admin/study-news" },
  { label: "Đơn ứng tuyển Du học", icon: ClipboardList, href: "/admin/study-applications" },
  { label: "Quản lý du lịch", icon: Plane, href: "/admin/travel" },
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
    <div className={s.root}>
      <div className={s.logoRow}>
        <Link to="/" className={s.logoLink}>
          <div className={s.logoMark} style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
            <span className={s.logoMarkText}>FL</span>
          </div>
          <div className={s.logoTitles}>
            <p className={s.logoTitle}>
              FLY <span className={s.logoAccent}>LABOUR</span>
            </p>
            <p className={s.logoSub}>Admin Control</p>
          </div>
        </Link>
        {mobile && (
          <button type="button" onClick={onClose} className={s.closeBtn}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className={s.userCard}>
        <div
          className={s.userAvatar}
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        >
          {user?.fullName?.charAt(0) || "A"}
        </div>
        <div className={s.userInfo}>
          <p className={s.userName}>{user?.fullName}</p>
          <p className={s.userRole}>Super Admin</p>
        </div>
      </div>

      <nav className={clsx(s.nav, "custom-scrollbar")}>
        {NAV.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={clsx(s.navLink, isActive ? s.navLinkActive : s.navLinkIdle)}
            >
              <item.icon
                size={18}
                className={clsx(s.navIcon, isActive ? s.navIconActive : s.navIconIdle)}
              />
              <span className={s.navLabel}>{item.label}</span>
              {isActive && <ChevronRight size={14} className={s.navIconActive} />}
            </Link>
          );
        })}
      </nav>

      <div className={s.footer}>
        <button type="button" onClick={handleLogout} className={s.btnLogout}>
          <LogOut size={18} /> Đăng xuất
        </button>
        <Link to="/" className={s.linkHome} onClick={onClose}>
          <Home size={18} /> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
