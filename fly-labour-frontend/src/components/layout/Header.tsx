import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  LayoutDashboard,
  Briefcase,
  Phone,
} from "lucide-react";
import { useAuthStore } from "@core/store/authStore";
import { useLangStore } from "@core/store/langStore";
import CountryFlag from "@components/widgets/CountryFlag";

import { useT } from "@core/hooks/useT";
import toast from "react-hot-toast";
import s from "./Header.module.scss";

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

  // Submenu states
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mobileSelectedCountry, setMobileSelectedCountry] = useState<string | null>(null);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggle } = useLangStore();
  const { t, lang } = useT();

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
  const cx = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

  const navLinkClass = (href: string) =>
    cx(s.navLinkBase, isActive(href) ? s.navLinkActive : s.navLinkIdle);

  return (
    <header
      className={s.root}
      data-scrolled={isScrolled}
    >
      <div className={cx(s.inner, "fl-shell")}>
        <div className={s.bar}>

          {/* Logo */}
          <Link to="/" className={s.logoLink}>
            <img src="/logo.png" alt="Fly Immigration" className={s.logoImg} />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className={s.navDesktop}>
            <Link to="/" className={navLinkClass("/")}>
              {lang === "vi" ? "Trang chủ" : "Home"}
            </Link>

            {/* Du học dropdown */}
            <div className={s.dropdownWrap} onMouseEnter={() => setStudyOpen(true)} onMouseLeave={() => { setStudyOpen(false); setHoveredCountry(null); }}>
              <button className={cx(s.navBtn, navLinkClass("/study"))}>
                {lang === "vi" ? "Du học" : "Study"}
                <ChevronDown size={13} className={cx(s.chevron, studyOpen && s.chevronOpen)} />
              </button>
              {studyOpen && (
                <div className={s.dropdownPanelWrap}>
                  <div className={cx(s.dropdownInner, s.dropdownInnerVisible)}>
                    <p className={s.dropdownHeading}>
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className={cx(s.dropdownList, s.dropdownListVisible)}>
                      {LABOUR_COUNTRIES.map((c) => {
                        const name = c.label.split(" ").slice(1).join(" ");
                        return (
                          <div
                            key={c.value}
                            className={s.dropdownItemWrap}
                            onMouseEnter={() => setHoveredCountry(c.value)}
                            onMouseLeave={() => setHoveredCountry(null)}
                          >
                            <div className={s.dropdownItemHeader}>
                              <CountryFlag country={c.value} className={s.dropdownFlag} />
                              <span className={s.dropdownItemText}>{name}</span>
                              <ChevronRight size={13} className={s.itemChevron} />
                            </div>

                            {hoveredCountry === c.value && (
                              <div className={s.submenuPanel}>
                                <Link
                                  to={`/study?country=${c.value}&studyType=university`}
                                  className={s.submenuItem}
                                  onClick={() => setStudyOpen(false)}
                                >
                                  🎓 {lang === "vi" ? "Đại học" : "University"}
                                </Link>
                                <Link
                                  to={`/study?country=${c.value}&studyType=college`}
                                  className={s.submenuItem}
                                  onClick={() => setStudyOpen(false)}
                                >
                                  🏫 {lang === "vi" ? "Cao đẳng" : "College"}
                                </Link>
                                <Link
                                  to={`/study?country=${c.value}&studyType=vocational`}
                                  className={s.submenuItem}
                                  onClick={() => setStudyOpen(false)}
                                >
                                  💼 {lang === "vi" ? "Du học nghề" : "Vocational"}
                                </Link>
                                <div className={s.submenuDivider} />
                                <Link
                                  to={`/study?country=${c.value}`}
                                  className={cx(s.submenuItem, s.submenuItemAll)}
                                  onClick={() => setStudyOpen(false)}
                                >
                                  🌐 {lang === "vi" ? "Tất cả" : "All"}
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className={s.dropdownFooter}>
                      <Link to="/study" className={s.dropdownViewAll} onClick={() => setStudyOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Du lịch dropdown */}
            <div className={s.dropdownWrap} onMouseEnter={() => setTravelOpen(true)} onMouseLeave={() => setTravelOpen(false)}>
              <button className={cx(s.navBtn, navLinkClass("/travel"))}>
                {lang === "vi" ? "Du lịch" : "Travel"}
                <ChevronDown size={13} className={cx(s.chevron, travelOpen && s.chevronOpen)} />
              </button>
              {travelOpen && (
                <div className={s.dropdownPanelWrap}>
                  <div className={s.dropdownInner}>
                    <p className={s.dropdownHeading}>
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className={s.dropdownList}>
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link key={c.value} to={`/travel?country=${c.value}`} className={s.dropdownItem} onClick={() => setTravelOpen(false)}>
                          <CountryFlag country={c.value} />
                          <span className={s.dropdownItemText}>{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className={s.dropdownFooter}>
                      <Link to="/travel" className={s.dropdownViewAll} onClick={() => setTravelOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Lao động dropdown */}
            <div className={s.dropdownWrap} onMouseEnter={() => setLabourOpen(true)} onMouseLeave={() => setLabourOpen(false)}>
              <button className={cx(s.navBtn, navLinkClass("/jobs"))}>
                {lang === "vi" ? "Lao động" : "Labour"}
                <ChevronDown size={13} className={cx(s.chevron, labourOpen && s.chevronOpen)} />
              </button>
              {labourOpen && (
                <div className={s.dropdownPanelWrap}>
                  <div className={s.dropdownInner}>
                    <p className={s.dropdownHeading}>
                      {lang === "vi" ? "Chọn quốc gia" : "Select Country"}
                    </p>
                    <div className={s.dropdownList}>
                      {LABOUR_COUNTRIES.map((c) => (
                        <Link key={c.value} to={`/jobs?country=${c.value}`} className={s.dropdownItem} onClick={() => setLabourOpen(false)}>
                          <CountryFlag country={c.value} />
                          <span className={s.dropdownItemText}>{c.label.split(" ").slice(1).join(" ")}</span>
                        </Link>
                      ))}
                    </div>
                    <div className={s.dropdownFooter}>
                      <Link to="/jobs" className={s.dropdownViewAll} onClick={() => setLabourOpen(false)}>
                        {lang === "vi" ? "Xem tất cả →" : "View All →"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/handbook" className={navLinkClass("/handbook")}>
              {lang === "vi" ? "Cẩm nang" : "Guide"}
            </Link>
            <Link to="/news" className={navLinkClass("/news")}>
              {lang === "vi" ? "Tin tức" : "News"}
            </Link>
            <Link to="/contact" className={navLinkClass("/contact")}>
              {lang === "vi" ? "Liên hệ" : "Contact"}
            </Link>

            {/* Phone */}
            <div className={s.phoneBlock}>
              <a href="tel:0866879755" className={s.phoneLink}>
                <Phone size={14} aria-hidden />
                0866-879-755
              </a>
            </div>
          </nav>

          {/* ── Right: Tools & Auth ── */}
          <div className={s.tools}>


            {/* Language toggle */}
            <button
              onClick={toggle}
              className={s.langBtn}
            >
              {lang === "vi" ? (
                <><CountryFlag country="vi" /> <span>VN</span></>
              ) : (
                <><CountryFlag country="en" /> <span>EN</span></>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className={s.userMenuWrap}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className={s.userMenuBtn}
                >
                  <div className={s.avatar} style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
                    {user.fullName.charAt(0)}
                  </div>
                  <span className={s.userName}>
                    {user.fullName}
                  </span>
                  <ChevronDown size={13} className={s.chevronMuted} />
                </button>
                {userMenu && (
                  <div className={s.userDropdown}>
                    {user.role === "admin" && (
                      <Link to="/admin" className={s.userDropLink} onClick={() => setUserMenu(false)}>
                        <LayoutDashboard size={15} /> {t("nav.adminDashboard")}
                      </Link>
                    )}
                    {user.role === "employer" && (
                      <Link to="/employer" className={s.userDropLink} onClick={() => setUserMenu(false)}>
                        <Briefcase size={15} /> {t("nav.employerDashboard")}
                      </Link>
                    )}
                    <Link to="/profile" className={s.userDropLink} onClick={() => setUserMenu(false)}>
                      <User size={15} /> {t("nav.myProfile")}
                    </Link>
                    <div className={s.userDivider} />
                    <button onClick={handleLogout} className={s.logoutBtn}>
                      <LogOut size={15} /> {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={cx("btn-primary", s.signInDesktop, s.signInSizing)}>
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className={s.hamburgerBtn}
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
        <div className={s.mobilePanel} style={{ maxHeight: "calc(100vh - 64px)" }}>

          {/* Trang chủ */}
          <Link to="/" className={s.mobileLink}>
            {lang === "vi" ? "Trang chủ" : "Home"}
          </Link>

          {/* Du học accordion */}
          <div className={s.mobileAccordion}>
            <button
              className={s.mobileAccordionBtn}
              onClick={() => setMobileStudy(!mobileStudy)}
            >
              {lang === "vi" ? "Du học" : "Study"}
              <ChevronDown size={16} className={cx(s.chevronMuted, s.chevron, mobileStudy && s.chevronOpen)} />
            </button>
            {mobileStudy && (
              <div className={s.mobileAccordionBody}>
                <div className={s.mobileCountryList}>
                  {LABOUR_COUNTRIES.map((c) => {
                    const isExpanded = mobileSelectedCountry === c.value;
                    return (
                      <div key={c.value} className={s.mobileCountryGroup}>
                        <button
                          type="button"
                          className={cx(s.mobileGridCell, isExpanded && s.mobileGridCellActive)}
                          onClick={() => setMobileSelectedCountry(isExpanded ? null : c.value)}
                        >
                          <span className={s.mobileFlag}><CountryFlag country={c.value} /></span>
                          <span className={s.mobileGridMeta}>{c.label.split(" ").slice(1).join(" ")}</span>
                          <ChevronDown size={14} className={cx(s.chevronMuted, s.chevron, isExpanded && s.chevronOpen)} style={{ marginLeft: "auto" }} />
                        </button>
                        {isExpanded && (
                          <div className={s.mobileSubmenu}>
                            <Link
                              to={`/study?country=${c.value}&studyType=university`}
                              className={s.mobileSubItem}
                              onClick={() => { setMobileOpen(false); setMobileSelectedCountry(null); }}
                            >
                              🎓 {lang === "vi" ? "Đại học" : "University"}
                            </Link>
                            <Link
                              to={`/study?country=${c.value}&studyType=college`}
                              className={s.mobileSubItem}
                              onClick={() => { setMobileOpen(false); setMobileSelectedCountry(null); }}
                            >
                              🏫 {lang === "vi" ? "Cao đẳng" : "College"}
                            </Link>
                            <Link
                              to={`/study?country=${c.value}&studyType=vocational`}
                              className={s.mobileSubItem}
                              onClick={() => { setMobileOpen(false); setMobileSelectedCountry(null); }}
                            >
                              💼 {lang === "vi" ? "Du học nghề" : "Vocational"}
                            </Link>
                            <Link
                              to={`/study?country=${c.value}`}
                              className={cx(s.mobileSubItem, s.mobileSubItemAll)}
                              onClick={() => { setMobileOpen(false); setMobileSelectedCountry(null); }}
                            >
                              🌐 {lang === "vi" ? "Tất cả chương trình" : "All Programs"}
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Link to="/study" className={s.mobileViewAll} onClick={() => { setMobileOpen(false); setMobileSelectedCountry(null); }}>
                  {lang === "vi" ? "Xem tất cả du học →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          {/* Du lịch accordion */}
          <div className={s.mobileAccordion}>
            <button
              className={s.mobileAccordionBtn}
              onClick={() => setMobileTravel(!mobileTravel)}
            >
              {lang === "vi" ? "Du lịch" : "Travel"}
              <ChevronDown size={16} className={cx(s.chevronMuted, s.chevron, mobileTravel && s.chevronOpen)} />
            </button>
            {mobileTravel && (
              <div className={s.mobileAccordionBody}>
                <div className={s.mobileGridLinks}>
                  {LABOUR_COUNTRIES.map((c) => (
                    <Link
                      key={c.value}
                      to={`/travel?country=${c.value}`}
                      className={s.mobileGridCell}
                      onClick={() => setMobileOpen(false)}
                    >
                      <CountryFlag country={c.value} />
                      <span className={s.mobileGridMeta}>{c.label.split(" ").slice(1).join(" ")}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/travel" className={s.mobileViewAll} onClick={() => setMobileOpen(false)}>
                  {lang === "vi" ? "Xem tất cả du lịch →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          {/* Lao động accordion */}
          <div className={s.mobileAccordion}>
            <button
              className={s.mobileAccordionBtn}
              onClick={() => setMobileLabour(!mobileLabour)}
            >
              {lang === "vi" ? "Lao động" : "Labour"}
              <ChevronDown size={16} className={cx(s.chevronMuted, s.chevron, mobileLabour && s.chevronOpen)} />
            </button>
            {mobileLabour && (
              <div className={s.mobileAccordionBody}>
                <div className={s.mobileGridLinks}>
                  {LABOUR_COUNTRIES.map((c) => (
                    <Link
                      key={c.value}
                      to={`/jobs?country=${c.value}`}
                      className={s.mobileGridCell}
                      onClick={() => setMobileOpen(false)}
                    >
                      <CountryFlag country={c.value} />
                      <span className={s.mobileGridMeta}>{c.label.split(" ").slice(1).join(" ")}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/jobs" className={s.mobileViewAll} onClick={() => setMobileOpen(false)}>
                  {lang === "vi" ? "Xem tất cả việc làm →" : "View All →"}
                </Link>
              </div>
            )}
          </div>

          <Link to="/handbook" className={s.mobileLink}>
            {lang === "vi" ? "Cẩm nang" : "Guide"}
          </Link>
          <Link to="/news" className={s.mobileLink}>
            {lang === "vi" ? "Tin tức" : "News"}
          </Link>
          <Link to="/contact" className={s.mobileLink}>
            {lang === "vi" ? "Liên hệ" : "Contact"}
          </Link>

          {/* Phone */}
          <a href="tel:0866879755" className={s.mobilePhone}>
            <Phone size={15} aria-hidden /> 0866-879-755
          </a>

          {/* Language */}
          <div className={s.mobileLangRow}>
            <button onClick={toggle} className={s.mobileLangBtn}>
              <span><CountryFlag country={lang === "vi" ? "vi" : "en"} /></span>
              {lang === "vi" ? "English" : "Tiếng Việt"}
            </button>
          </div>

          {/* Auth */}
          {!isAuthenticated ? (
            <div className={s.mobileAuthBlock}>
              <Link to="/login" className={cx("btn-primary", s.mobileSignIn)} onClick={() => setMobileOpen(false)}>
                {lang === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            </div>
          ) : (
            <div className={cx(s.mobileAuthBlock, s.mobileAuthRow)}>
              <Link to="/profile" className={s.mobileProfileLink} onClick={() => setMobileOpen(false)}>
                <div className={s.avatar} style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}>
                  {user?.fullName.charAt(0)}
                </div>
                {user?.fullName}
              </Link>
              <button onClick={handleLogout} className={s.mobileLogoutIcon}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
