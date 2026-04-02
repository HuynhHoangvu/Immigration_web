import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Phone,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLangStore } from "@/store/langStore";
import { useThemeStore } from "@/store/themeStore";
import { useT } from "@/hooks/useT";
import toast from "react-hot-toast";

// Danh sách quốc gia lao động xổ xuống
const LABOUR_COUNTRIES = [
  { label: "🇦🇺 Úc", value: "australia" },
  { label: "🇨🇦 Canada", value: "canada" },
  { label: "🇳🇿 New Zealand", value: "new_zealand" },
  { label: "🇯🇵 Nhật Bản", value: "japan" },
  { label: "🇩🇪 Đức", value: "germany" },
  { label: "🇰🇷 Hàn Quốc", value: "south_korea" },
  { label: "🇸🇬 Singapore", value: "singapore" },
  { label: "🇹🇼 Đài Loan", value: "taiwan" },
  { label: "🇳🇴 Na Uy", value: "norway" },
  { label: "🇵🇹 Bồ Đào Nha", value: "portugal" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [labourOpen, setLabourOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggle } = useLangStore();
  const { t, lang } = useT();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success(lang === "vi" ? "Đã đăng xuất" : "Logged out");
    navigate("/");
    setUserMenu(false);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 header-theme ${
        isScrolled ? "backdrop-blur-lg shadow-md shadow-black/6" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300"
              style={{
                background: "linear-gradient(135deg, #e4a808, #fdd52f)",
              }}
            >
              <span className="text-white font-display text-base font-black">
                FI
              </span>
            </div>
            <div>
              <span className="font-display text-xl text-slate-900 dark:text-white tracking-wider">
                FLY
              </span>
              <span
                className="font-display text-xl tracking-wider"
                style={{ color: "#e4a808" }}
              >
                {" "}
                Immigration
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Trang chủ */}
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive("/")
                  ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }`}
            >
              {lang === "vi" ? "Trang chủ" : "Home"}
            </Link>

            {/* Du học xổ xuống */}
            <div
              className="relative"
              onMouseEnter={() => setStudyOpen(true)}
              onMouseLeave={() => setStudyOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname === "/study"
                    ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
              >
                {lang === "vi" ? "Du học" : "Study Abroad"}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${studyOpen ? "rotate-180" : ""}`}
                />
              </button>

              {studyOpen && (
                <div className="absolute top-full left-0 w-52 pt-2">
                  <div className="header-theme border rounded-xl shadow-xl overflow-hidden">
                    <div className="px-3 pt-2.5 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-gray-100">
                        {lang === "vi" ? "Chọn quốc gia" : "Select country"}
                      </p>
                    </div>
                    {LABOUR_COUNTRIES.map((c) => (
                      <Link
                        key={c.value}
                        to={`/study?country=${c.value}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        onClick={() => setStudyOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 m-1">
                      <Link
                        to="/study"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors rounded-lg"
                        onClick={() => setStudyOpen(false)}
                      >
                        {lang === "vi"
                          ? "Xem tất cả du học →"
                          : "View all study programs →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Du lịch xổ xuống */}
            <div
              className="relative"
              onMouseEnter={() => setTravelOpen(true)}
              onMouseLeave={() => setTravelOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname === "/travel"
                    ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
              >
                {lang === "vi" ? "Du lịch" : "Travel"}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${travelOpen ? "rotate-180" : ""}`}
                />
              </button>

              {travelOpen && (
                <div className="absolute top-full left-0 w-52 pt-2">
                  <div className="header-theme border rounded-xl shadow-xl overflow-hidden">
                    <div className="px-3 pt-2.5 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-gray-100">
                        {lang === "vi" ? "Chọn quốc gia" : "Select country"}
                      </p>
                    </div>
                    {LABOUR_COUNTRIES.map((c) => (
                      <Link
                        key={c.value}
                        to={`/travel?country=${c.value}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        onClick={() => setTravelOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 m-1">
                      <Link
                        to="/travel"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors rounded-lg"
                        onClick={() => setTravelOpen(false)}
                      >
                        {lang === "vi"
                          ? "Xem tất cả du lịch →"
                          : "View all travel →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lao động xổ xuống */}
            <div
              className="relative"
              onMouseEnter={() => setLabourOpen(true)}
              onMouseLeave={() => setLabourOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname === "/jobs"
                    ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                    : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
              >
                {lang === "vi" ? "Lao động" : "Labour"}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${labourOpen ? "rotate-180" : ""}`}
                />
              </button>

              {labourOpen && (
                <div className="absolute top-full left-0 w-52 pt-2">
                  <div className="header-theme border rounded-xl shadow-xl overflow-hidden">
                    <div className="px-3 pt-2.5 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-gray-100">
                        {lang === "vi" ? "Chọn quốc gia" : "Select country"}
                      </p>
                    </div>
                    {LABOUR_COUNTRIES.map((c) => (
                      <Link
                        key={c.value}
                        to={`/jobs?country=${c.value}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        onClick={() => setLabourOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 m-1">
                      <Link
                        to="/jobs"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors rounded-lg"
                        onClick={() => setLabourOpen(false)}
                      >
                        {lang === "vi"
                          ? "Xem tất cả việc làm →"
                          : "View all jobs →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tin tức */}
            <Link
              to="/news"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive("/news")
                  ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }`}
            >
              {lang === "vi" ? "Tin tức" : "News"}
            </Link>

            {/* Liên hệ */}
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive("/contact")
                  ? "text-slate-900 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              }`}
            >
              {lang === "vi" ? "Liên hệ" : "Contact"}
            </Link>

            {/* Số điện thoại */}
            <a
              href="tel:+84901234567"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            >
              <Phone size={14} />
              0333 318 882
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Chuyển sang Light Mode"
                  : "Chuyển sang Dark Mode"
              }
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 transition-colors shadow-sm text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language toggle - icon only */}
            <button
              onClick={toggle}
              title={
                lang === "vi" ? "Chuyển sang English" : "Switch to Tiếng Việt"
              }
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-amber-400 transition-colors shadow-sm text-lg"
            >
              {lang === "vi" ? "🇻🇳" : "En"}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 header-theme border rounded-xl px-3 py-2 hover:border-amber-400 transition-colors shadow-sm"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs"
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-900 dark:text-gray-100 hidden sm:block max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-slate-900 dark:text-gray-100"
                  />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 header-theme border rounded-xl shadow-xl overflow-hidden">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-900 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        onClick={() => setUserMenu(false)}
                      >
                        <LayoutDashboard size={16} /> {t("nav.adminDashboard")}
                      </Link>
                    )}
                    {user.role === "employer" && (
                      <Link
                        to="/employer"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-900 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        onClick={() => setUserMenu(false)}
                      >
                        <Briefcase size={16} /> {t("nav.employerDashboard")}
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors"
                      onClick={() => setUserMenu(false)}
                    >
                      <User size={16} /> {t("nav.myProfile")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} /> {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block btn-primary text-sm px-4 py-2"
              >
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-slate-900 dark:text-gray-100 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden header-theme border-t shadow-lg">
          {/* Trang chủ */}
          <Link
            to="/"
            className="block px-6 py-3 text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border-b border-gray-100 dark:border-gray-800 text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Trang chủ" : "Home"}
          </Link>

          {/* Du học */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="px-6 py-3 text-amber-700 dark:text-amber-400 text-sm font-bold bg-amber-50 dark:bg-amber-900/20">
              {lang === "vi" ? "Du học theo quốc gia" : "Study by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/study?country=${c.value}`}
                className="block px-8 py-2.5 text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm border-b border-gray-50 dark:border-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* Du lịch */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="px-6 py-3 text-amber-700 dark:text-amber-400 text-sm font-bold bg-amber-50 dark:bg-amber-900/20">
              {lang === "vi" ? "Du lịch theo quốc gia" : "Travel by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/travel?country=${c.value}`}
                className="block px-8 py-2.5 text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm border-b border-gray-50 dark:border-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* Lao động */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <div className="px-6 py-3 text-amber-700 dark:text-amber-400 text-sm font-bold bg-amber-50 dark:bg-amber-900/20">
              {lang === "vi" ? "Lao động theo quốc gia" : "Labour by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/jobs?country=${c.value}`}
                className="block px-8 py-2.5 text-slate-900 dark:text-gray-100 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-sm border-b border-gray-50 dark:border-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>

          <Link
            to="/news"
            className="block px-6 py-3 text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border-b border-gray-100 dark:border-gray-800 text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Tin tức" : "News"}
          </Link>

          <Link
            to="/contact"
            className="block px-6 py-3 text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors border-b border-gray-100 dark:border-gray-800 text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </Link>

          {/* Số điện thoại */}
          <a
            href="tel:+84901234567"
            className="flex items-center gap-2 px-6 py-3 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-b border-gray-100 dark:border-gray-800 text-sm font-semibold"
          >
            <Phone size={15} /> 0901 234 567
          </a>

          {/* Theme toggle mobile */}
          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {theme === "dark"
                ? lang === "vi"
                  ? "Chế độ sáng"
                  : "Light Mode"
                : lang === "vi"
                  ? "Chế độ tối"
                  : "Dark Mode"}
            </button>
          </div>

          {/* Language toggle mobile - icon only */}
          <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={toggle}
              className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-gray-100 hover:text-slate-900 dark:hover:text-amber-400"
            >
              <span className="text-lg">{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
              {lang === "vi" ? "English" : "Tiếng Việt"}
            </button>
          </div>

          {!isAuthenticated && (
            <div className="p-4">
              <Link
                to="/login"
                className="btn-primary w-full text-center text-sm py-2 font-semibold rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
