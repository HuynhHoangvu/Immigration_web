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
  // Desktop hover dropdowns
  const [studyOpen, setStudyOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [labourOpen, setLabourOpen] = useState(false);
  // Mobile accordion (tap to expand)
  const [mobileStudy, setMobileStudy] = useState(false);
  const [mobileTravel, setMobileTravel] = useState(false);
  const [mobileLabour, setMobileLabour] = useState(false);
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

  // Đóng mobile menu khi chuyển route
  useEffect(() => {
    setMobileOpen(false);
    setMobileStudy(false);
    setMobileTravel(false);
    setMobileLabour(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success(lang === "vi" ? "Đã đăng xuất" : "Logged out");
    navigate("/");
    setUserMenu(false);
  };

  const isActive = (href: string) => location.pathname === href;

  const navLinkBase = "px-3 py-2 text-sm font-semibold rounded-xl transition-all";
  const navLinkActive = "text-amber-700 bg-amber-50 dark:text-brand-gold dark:bg-brand-gold/10";
  const navLinkIdle = "text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10";

  const dropdownItemClass = "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-gray-200 hover:text-brand-gold hover:bg-brand-gold/5 transition-all rounded-xl";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-all duration-300 bg-white/95 dark:bg-[#0d1117]/95 ${
        isScrolled ? "backdrop-blur-md shadow-sm border-slate-200 dark:border-white/5" : ""
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="Fly Immigration" className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <Link to="/" className={`${navLinkBase} ${isActive("/") ? navLinkActive : navLinkIdle}`}>
              {lang === "vi" ? "Trang chủ" : "Home"}
            </Link>

            {/* Du học dropdown */}
            <div className="relative" onMouseEnter={() => setStudyOpen(true)} onMouseLeave={() => setStudyOpen(false)}>
              <button className={`${navLinkBase} flex items-center gap-1.5 ${isActive("/study") ? navLinkActive : navLinkIdle}`}>
                {lang === "vi" ? "Du học" : "Study"}
                <ChevronDown size={13} className={`transition-transform duration-200 ${studyOpen ? "rotate-180" : ""}`} />
              </button>
              {studyOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white dark:bg-brand-card border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden py-1.5">
                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-50 dark:border-white/5 mb-1">
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className="max-h-64 overflow-y-auto px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link key={c.value} to={`/study?country=${c.value}`} className={dropdownItemClass} onClick={() => setStudyOpen(false)}>
                          <span>{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-1">
                      <Link to="/study" className="flex items-center justify-center py-2 text-xs font-bold text-amber-600 dark:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 rounded-xl transition-colors" onClick={() => setStudyOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Du lịch dropdown */}
            <div className="relative" onMouseEnter={() => setTravelOpen(true)} onMouseLeave={() => setTravelOpen(false)}>
              <button className={`${navLinkBase} flex items-center gap-1.5 ${isActive("/travel") ? navLinkActive : navLinkIdle}`}>
                {lang === "vi" ? "Du lịch" : "Travel"}
                <ChevronDown size={13} className={`transition-transform duration-200 ${travelOpen ? "rotate-180" : ""}`} />
              </button>
              {travelOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white dark:bg-brand-card border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden py-1.5">
                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-50 dark:border-white/5 mb-1">
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className="max-h-64 overflow-y-auto px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link key={c.value} to={`/travel?country=${c.value}`} className={dropdownItemClass} onClick={() => setTravelOpen(false)}>
                          <span>{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-1">
                      <Link to="/travel" className="flex items-center justify-center py-2 text-xs font-bold text-amber-600 dark:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 rounded-xl transition-colors" onClick={() => setTravelOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lao động dropdown */}
            <div className="relative" onMouseEnter={() => setLabourOpen(true)} onMouseLeave={() => setLabourOpen(false)}>
              <button className={`${navLinkBase} flex items-center gap-1.5 ${isActive("/jobs") ? navLinkActive : navLinkIdle}`}>
                {lang === "vi" ? "Lao động" : "Labour"}
                <ChevronDown size={13} className={`transition-transform duration-200 ${labourOpen ? "rotate-180" : ""}`} />
              </button>
              {labourOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white dark:bg-brand-card border border-slate-100 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden py-1.5">
                    <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-50 dark:border-white/5 mb-1">
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className="max-h-64 overflow-y-auto px-1">
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link key={c.value} to={`/jobs?country=${c.value}`} className={dropdownItemClass} onClick={() => setLabourOpen(false)}>
                          <span>{c.label.split(" ")[0]}</span>
                          <span className="truncate">{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-white/5 mx-2 mt-1 pt-1">
                      <Link to="/jobs" className="flex items-center justify-center py-2 text-xs font-bold text-amber-600 dark:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 rounded-xl transition-colors" onClick={() => setLabourOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/handbook" className={`${navLinkBase} ${isActive("/handbook") ? navLinkActive : navLinkIdle}`}>
              {lang === "vi" ? "Cẩm nang" : "Guide"}
            </Link>
            <Link to="/news" className={`${navLinkBase} ${isActive("/news") ? navLinkActive : navLinkIdle}`}>
              {lang === "vi" ? "Tin tức" : "News"}
            </Link>
            <Link to="/contact" className={`${navLinkBase} ${isActive("/contact") ? navLinkActive : navLinkIdle}`}>
              {lang === "vi" ? "Liên hệ" : "Contact"}
            </Link>

            {/* Phone */}
            <div className="ml-1 pl-2 border-l border-slate-200 dark:border-white/10">
              <a href="tel:0866879755" className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-400/10 rounded-xl transition-colors whitespace-nowrap">
                <Phone size={14} className="fill-current" />
                0866-879-755
              </a>
            </div>
          </nav>

          {/* ── Right: Tools & Auth ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-600 dark:hover:border-brand-gold dark:hover:text-brand-gold transition-colors bg-white dark:bg-brand-card shadow-sm"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggle}
              className="hidden md:flex items-center justify-center gap-1.5 px-3 h-9 rounded-xl border border-slate-200 dark:border-white/10 hover:border-amber-400 dark:hover:border-brand-gold transition-colors bg-white dark:bg-brand-card shadow-sm text-sm font-bold text-slate-700 dark:text-gray-200"
            >
              {lang === "vi" ? (
                <>🇻🇳 <span>VN</span></>
              ) : (
                <>🇺🇸 <span>EN</span></>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 bg-white dark:bg-brand-card border border-slate-200 dark:border-white/10 rounded-xl p-1.5 pr-2.5 hover:border-amber-400 dark:hover:border-brand-gold transition-colors shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-900 font-bold text-xs" style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-gray-200 hidden sm:block max-w-[90px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-brand-card border border-slate-100 dark:border-brand-border rounded-2xl shadow-xl overflow-hidden py-1 z-50">
                    {user.role === "admin" && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors" onClick={() => setUserMenu(false)}>
                        <LayoutDashboard size={15} /> {t("nav.adminDashboard")}
                      </Link>
                    )}
                    {user.role === "employer" && (
                      <Link to="/employer" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors" onClick={() => setUserMenu(false)}>
                        <Briefcase size={15} /> {t("nav.employerDashboard")}
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-200 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-brand-gold dark:hover:bg-brand-gold/10 transition-colors" onClick={() => setUserMenu(false)}>
                      <User size={15} /> {t("nav.myProfile")}
                    </Link>
                    <div className="border-t border-slate-100 dark:border-white/5 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <LogOut size={15} /> {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center btn-primary text-sm font-medium px-4 py-2 h-9">
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0d1117] border-t border-slate-100 dark:border-white/5 shadow-2xl overflow-y-auto" style={{ maxHeight: "calc(100vh - 64px)" }}>

          {/* Trang chủ */}
          <Link to="/" className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors">
            {lang === "vi" ? "Trang chủ" : "Home"}
          </Link>

          {/* Du học accordion */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
              onClick={() => setMobileStudy(!mobileStudy)}
            >
              {lang === "vi" ? "Du học" : "Study"}
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${mobileStudy ? "rotate-180" : ""}`} />
            </button>
            {mobileStudy && (
              <div className="bg-slate-50 dark:bg-white/3 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-0">
                  {LABOUR_COUNTRIES.map((c) => (
                    <Link
                      key={c.value}
                      to={`/study?country=${c.value}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-r border-slate-100 dark:border-white/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{c.label.split(" ")[0]}</span>
                      <span className="truncate text-xs">{c.label.split(" ").slice(1).join(" ")}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/study" className="flex items-center justify-center py-2.5 text-xs font-bold text-amber-600 dark:text-brand-gold border-t border-slate-100 dark:border-white/5" onClick={() => setMobileOpen(false)}>
                  {lang === "vi" ? "Xem tất cả du học →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          {/* Du lịch accordion */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
              onClick={() => setMobileTravel(!mobileTravel)}
            >
              {lang === "vi" ? "Du lịch" : "Travel"}
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${mobileTravel ? "rotate-180" : ""}`} />
            </button>
            {mobileTravel && (
              <div className="bg-slate-50 dark:bg-white/3 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-0">
                  {LABOUR_COUNTRIES.map((c) => (
                    <Link
                      key={c.value}
                      to={`/travel?country=${c.value}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-r border-slate-100 dark:border-white/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{c.label.split(" ")[0]}</span>
                      <span className="truncate text-xs">{c.label.split(" ").slice(1).join(" ")}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/travel" className="flex items-center justify-center py-2.5 text-xs font-bold text-amber-600 dark:text-brand-gold border-t border-slate-100 dark:border-white/5" onClick={() => setMobileOpen(false)}>
                  {lang === "vi" ? "Xem tất cả du lịch →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          {/* Lao động accordion */}
          <div className="border-b border-slate-100 dark:border-white/5">
            <button
              className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors"
              onClick={() => setMobileLabour(!mobileLabour)}
            >
              {lang === "vi" ? "Lao động" : "Labour"}
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${mobileLabour ? "rotate-180" : ""}`} />
            </button>
            {mobileLabour && (
              <div className="bg-slate-50 dark:bg-white/3 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-0">
                  {LABOUR_COUNTRIES.map((c) => (
                    <Link
                      key={c.value}
                      to={`/jobs?country=${c.value}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-brand-gold/10 transition-colors border-b border-r border-slate-100 dark:border-white/5"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{c.label.split(" ")[0]}</span>
                      <span className="truncate text-xs">{c.label.split(" ").slice(1).join(" ")}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/jobs" className="flex items-center justify-center py-2.5 text-xs font-bold text-amber-600 dark:text-brand-gold border-t border-slate-100 dark:border-white/5" onClick={() => setMobileOpen(false)}>
                  {lang === "vi" ? "Xem tất cả việc làm →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          <Link to="/handbook" className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors">
            {lang === "vi" ? "Cẩm nang" : "Guide"}
          </Link>
          <Link to="/news" className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors">
            {lang === "vi" ? "Tin tức" : "News"}
          </Link>
          <Link to="/contact" className="flex items-center px-5 py-3.5 text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 hover:bg-amber-50 dark:hover:bg-brand-gold/10 hover:text-amber-600 dark:hover:text-brand-gold transition-colors">
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </Link>

          {/* Phone */}
          <a href="tel:0866879755" className="flex items-center gap-2 px-5 py-3.5 text-sm font-bold text-green-600 dark:text-green-400 border-b border-slate-100 dark:border-white/5 hover:bg-green-50 dark:hover:bg-green-400/10 transition-colors">
            <Phone size={15} className="fill-current" /> 0866-879-755
          </a>

          {/* Theme / Language */}
          <div className="flex items-center px-5 py-3.5 border-b border-slate-100 dark:border-white/5 gap-4">
            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {lang === "vi" ? (theme === "dark" ? "Sáng" : "Tối") : (theme === "dark" ? "Light" : "Dark")}
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
            <button onClick={toggle} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-brand-gold">
              <span>{lang === "vi" ? "🇻🇳" : "🇺🇸"}</span>
              {lang === "vi" ? "English" : "Tiếng Việt"}
            </button>
          </div>

          {/* Auth */}
          {!isAuthenticated ? (
            <div className="p-4">
              <Link to="/login" className="btn-primary flex justify-center text-sm py-3 font-semibold rounded-xl w-full" onClick={() => setMobileOpen(false)}>
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-between">
              <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-gray-200" onClick={() => setMobileOpen(false)}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-900 font-bold text-xs" style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
                  {user?.fullName.charAt(0)}
                </div>
                {user?.fullName}
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-red-500 dark:text-red-400">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
