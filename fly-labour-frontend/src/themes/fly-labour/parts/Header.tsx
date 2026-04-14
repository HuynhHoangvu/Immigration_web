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
import { useAuthStore } from "@/core/store/authStore";
import { useLangStore } from "@/core/store/langStore";
import { useThemeStore } from "@/core/store/themeStore";
import { useT } from "@/core/hooks/useT";
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
      className={`fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all duration-300 bg-white/90 dark:bg-[#0d1117]/90 ${
        isScrolled
          ? "backdrop-blur-md shadow-sm border-slate-200 dark:border-white/5"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Fly Immigration"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Trang chủ */}
            <Link
              to="/"
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                isActive("/")
                  ? "text-amber-700 bg-amber-50 dark:text-brand-gold dark:bg-brand-gold/10"
                  : "text-slate-600 dark:text-gray-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10"
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
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-xl transition-all ${
                  location.pathname === "/study"
                    ? "text-brand-gold bg-brand-gold/10"
                    : "text-slate-600 dark:text-gray-300 hover:text-brand-gold hover:bg-brand-gold/5"
                }`}
              >
                {lang === "vi" ? "Du học" : "Study"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${studyOpen ? "rotate-180" : ""}`}
                />
              </button>

              {studyOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 group-hover:block transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/95 dark:bg-brand-card/95 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl shadow-black/5 overflow-hidden py-2">
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-white/5 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-brand-muted">
                        {lang === "vi" ? "Chương trình du học" : "Study Abroad"}
                      </p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link
                          key={c.value}
                          to={`/study?country=${c.value}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-gray-200 hover:text-brand-gold hover:bg-brand-gold/5 transition-all rounded-xl"
                          onClick={() => setStudyOpen(false)}
                        >
                          <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-2">
                      <Link
                        to="/study"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10 transition-colors rounded-xl bg-brand-gold/5"
                        onClick={() => setStudyOpen(false)}
                      >
                        {lang === "vi"
                          ? "Tất cả du học"
                          : "View All"}
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
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold rounded-xl transition-all ${
                  location.pathname === "/travel"
                    ? "text-brand-gold bg-brand-gold/10"
                    : "text-slate-600 dark:text-gray-300 hover:text-brand-gold hover:bg-brand-gold/5"
                }`}
              >
                {lang === "vi" ? "Du lịch" : "Travel"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${travelOpen ? "rotate-180" : ""}`}
                />
              </button>

              {travelOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 group-hover:block transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/95 dark:bg-brand-card/95 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl shadow-black/5 overflow-hidden py-2">
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-white/5 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-brand-muted">
                        {lang === "vi" ? "Visa du lịch" : "Travel Visa"}
                      </p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link
                          key={c.value}
                          to={`/travel?country=${c.value}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-gray-200 hover:text-brand-gold hover:bg-brand-gold/5 transition-all rounded-xl"
                          onClick={() => setTravelOpen(false)}
                        >
                          <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-2">
                      <Link
                        to="/travel"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10 transition-colors rounded-xl bg-brand-gold/5"
                        onClick={() => setTravelOpen(false)}
                      >
                        {lang === "vi"
                          ? "Tất cả du lịch"
                          : "View All"}
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
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                  location.pathname === "/jobs"
                    ? "text-amber-700 bg-amber-50 dark:text-brand-gold dark:bg-brand-gold/10"
                    : "text-slate-600 dark:text-gray-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10"
                }`}
              >
                {lang === "vi" ? "Lao động" : "Labour"}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${labourOpen ? "rotate-180" : ""}`}
                />
              </button>

              {labourOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 group-hover:block transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/95 dark:bg-brand-card/95 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl shadow-black/5 overflow-hidden py-2">
                    <div className="px-4 py-2 border-b border-slate-50 dark:border-white/5 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-brand-muted">
                        {lang === "vi" ? "Thị trường lao động" : "Labour Markets"}
                      </p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link
                          key={c.value}
                          to={`/jobs?country=${c.value}`}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-gray-200 hover:text-brand-gold hover:bg-brand-gold/5 transition-all rounded-xl"
                          onClick={() => setLabourOpen(false)}
                        >
                          <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-2">
                      <Link
                        to="/jobs"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-widest text-brand-gold hover:bg-brand-gold/10 transition-colors rounded-xl bg-brand-gold/5"
                        onClick={() => setLabourOpen(false)}
                      >
                        {lang === "vi"
                          ? "Tất cả việc làm"
                          : "Explore All"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thông tin */}
            <Link
              to="/handbook"
              className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all ${
                isActive("/handbook")
                  ? "text-amber-700 bg-amber-50 dark:text-brand-gold dark:bg-brand-gold/10"
                  : "text-slate-600 dark:text-gray-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10"
              }`}
            >
              {lang === "vi" ? "Thông tin" : "Information"}
            </Link>

            {/* Tin tức */}
            <Link
              to="/news"
              className={`px-3.5 py-2 text-sm font-bold rounded-xl transition-all ${
                isActive("/news")
                  ? "text-brand-gold bg-brand-gold/10"
                  : "text-slate-600 dark:text-gray-300 hover:text-brand-gold hover:bg-brand-gold/5"
              }`}
            >
              {lang === "vi" ? "Tin tức" : "News"}
            </Link>

            {/* Liên hệ */}
            <Link
              to="/contact"
              className={`px-3.5 py-2 text-sm font-bold rounded-xl transition-all ${
                isActive("/contact")
                  ? "text-brand-gold bg-brand-gold/10"
                  : "text-slate-600 dark:text-gray-300 hover:text-brand-gold hover:bg-brand-gold/5"
              }`}
            >
              {lang === "vi" ? "Liên hệ" : "Contact"}
            </Link>

            {/* Số điện thoại */}
            <div className="ml-2 pl-3 border-l border-slate-200 dark:border-white/10">
              <a
                href="tel:0866879755"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-400/10 rounded-xl transition-colors"
              >
                <Phone size={14} className="fill-current" />
                0866-879-755
              </a>
            </div>
          </nav>

          {/* Right side (Icons & Auth) */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Chuyển sang Light Mode"
                  : "Chuyển sang Dark Mode"
              }
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 dark:hover:border-brand-gold dark:hover:text-brand-gold transition-colors bg-white dark:bg-brand-card shadow-sm"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language toggle - icon only */}
            <button
              onClick={toggle}
              title={
                lang === "vi" ? "Chuyển sang English" : "Switch to Tiếng Việt"
              }
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-brand-gold transition-colors bg-white dark:bg-brand-card shadow-sm text-lg"
            >
              {lang === "vi" ? "🇻🇳" : "🇬🇧"}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-white dark:bg-brand-card border border-slate-200 dark:border-white/10 rounded-xl p-1.5 pr-3 hover:border-amber-400 dark:hover:border-brand-gold transition-colors shadow-sm"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-900 font-bold text-xs"
                    style={{
                      background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                    }}
                  >
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-200 hidden sm:block max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-slate-400 dark:text-gray-400"
                  />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-brand-card border border-slate-100 dark:border-brand-border rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl overflow-hidden py-1">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors"
                        onClick={() => setUserMenu(false)}
                      >
                        <LayoutDashboard size={16} /> {t("nav.adminDashboard")}
                      </Link>
                    )}
                    {user.role === "employer" && (
                      <Link
                        to="/employer"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors"
                        onClick={() => setUserMenu(false)}
                      >
                        <Briefcase size={16} /> {t("nav.employerDashboard")}
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors"
                      onClick={() => setUserMenu(false)}
                    >
                      <User size={16} /> {t("nav.myProfile")}
                    </Link>
                    <div className="border-t border-slate-100 dark:border-white/5 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} /> {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center btn-primary text-sm font-medium px-5 py-2.5 h-10"
              >
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Trượt xuống) */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-brand-card border-t border-slate-200 dark:border-brand-border shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Trang chủ */}
          <Link
            to="/"
            className="block px-6 py-4 text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-slate-100 dark:border-white/5 text-sm font-bold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Trang chủ" : "Home"}
          </Link>

          {/* Du học */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <div className="px-6 py-3 text-amber-600 dark:text-brand-gold text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-brand-gold/5">
              {lang === "vi" ? "Du học theo quốc gia" : "Study by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/study?country=${c.value}`}
                className="flex items-center gap-2.5 px-6 py-3.5 text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium border-b border-slate-50 dark:border-white/5 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{c.label.split(" ")[0]}</span>
                <span>{c.label.split(" ").slice(1).join(" ")}</span>
              </Link>
            ))}
          </div>

          {/* Du lịch */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <div className="px-6 py-3 text-amber-600 dark:text-brand-gold text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-brand-gold/5">
              {lang === "vi" ? "Du lịch theo quốc gia" : "Travel by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/travel?country=${c.value}`}
                className="flex items-center gap-2.5 px-6 py-3.5 text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium border-b border-slate-50 dark:border-white/5 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{c.label.split(" ")[0]}</span>
                <span>{c.label.split(" ").slice(1).join(" ")}</span>
              </Link>
            ))}
          </div>

          {/* Lao động */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <div className="px-6 py-3 text-amber-600 dark:text-brand-gold text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-brand-gold/5">
              {lang === "vi" ? "Lao động theo quốc gia" : "Labour by Country"}
            </div>
            {LABOUR_COUNTRIES.map((c) => (
              <Link
                key={c.value}
                to={`/jobs?country=${c.value}`}
                className="flex items-center gap-2.5 px-6 py-3.5 text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium border-b border-slate-50 dark:border-white/5 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-lg">{c.label.split(" ")[0]}</span>
                <span>{c.label.split(" ").slice(1).join(" ")}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/news"
            className="block px-6 py-4 text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-slate-100 dark:border-white/5 text-sm font-bold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Tin tức" : "News"}
          </Link>

          <Link
            to="/contact"
            className="block px-6 py-4 text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-slate-100 dark:border-white/5 text-sm font-bold"
            onClick={() => setMobileOpen(false)}
          >
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </Link>

          {/* Số điện thoại Mobile */}
          <a
            href="tel:0866879755"
            className="flex items-center gap-2 px-6 py-4 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-400/10 transition-colors border-b border-slate-100 dark:border-white/5 text-sm font-bold"
          >
            <Phone size={16} className="fill-current" /> 0866-879-755
          </a>

          {/* Toggle công cụ Mobile */}
          <div className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-white/5">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold border-r border-slate-200 dark:border-white/10"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {lang === "vi"
                ? theme === "dark"
                  ? "Sáng"
                  : "Tối"
                : theme === "dark"
                  ? "Light"
                  : "Dark"}
            </button>
            <button
              onClick={toggle}
              className="flex-1 flex justify-end items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold"
            >
              <span className="text-xl">{lang === "vi" ? "🇻🇳" : "🇬🇧"}</span>
              {lang === "vi" ? "English" : "Tiếng Việt"}
            </button>
          </div>

          {!isAuthenticated && (
            <div className="p-6 bg-slate-50 dark:bg-white/5">
              <Link
                to="/login"
                className="btn-primary flex justify-center text-sm py-3.5 font-semibold rounded-xl w-full"
                onClick={() => setMobileOpen(false)}
              >
                {lang === "vi" ? "Đăng nhập hệ thống" : "Sign In"}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
