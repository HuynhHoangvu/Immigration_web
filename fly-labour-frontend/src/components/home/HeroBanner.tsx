import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  Play,
  Pause,
} from "lucide-react";
import { useT } from "@core/hooks/useT";
import clsx from "clsx";
import CountryFlag from "@components/widgets/CountryFlag";
import s from "./HeroBanner.module.scss";

const SLIDE_CONFIG = [
  {
    ctaLink: "/jobs?country=australia",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&fit=crop",
    imageAlt: "Australia farm",
    accent: "#fdd52f",
  },
  {
    ctaLink: "/jobs?country=canada",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1600&q=80&fit=crop",
    imageAlt: "Canada landscape",
    accent: "#e4a808",
  },
  {
    ctaLink: "/jobs?country=new_zealand",
    image:
      "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1600&q=80&fit=crop",
    imageAlt: "New Zealand nature",
    accent: "#D97706",
  },
  {
    ctaLink: "/jobs?country=japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=80&fit=crop",
    imageAlt: "Japan Tokyo night skyline",
    accent: "#E83929",
  },
  {
    ctaLink: "/jobs?country=uk",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=80&fit=crop",
    imageAlt: "United Kingdom London",
    accent: "#C8102E",
  },
  {
    ctaLink: "/jobs?country=germany",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1600&q=80&fit=crop",
    imageAlt: "Germany landscape",
    accent: "#F5A623",
  },
];

// Ken Burns variants — mỗi slide zoom từ hướng khác nhau
const KB_VARIANTS = [
  { transformOrigin: "center center", animationName: "kenBurns" },
  { transformOrigin: "top left", animationName: "kenBurnsReverse" },
  { transformOrigin: "bottom right", animationName: "kenBurns" },
  { transformOrigin: "center left", animationName: "kenBurnsReverse" },
  { transformOrigin: "top right", animationName: "kenBurns" },
  { transformOrigin: "bottom center", animationName: "kenBurnsReverse" },
  { transformOrigin: "center right", animationName: "kenBurns" },
];

const TICKER_ITEMS = [
  { country: "australia", text: "Sydney · NSW" },
  { country: "australia", text: "Melbourne · VIC" },
  { country: "australia", text: "Brisbane · QLD" },
  { country: "australia", text: "Perth · WA" },
  { country: "australia", text: "Adelaide · SA" },
  { country: "canada", text: "Toronto · ON" },
  { country: "canada", text: "Vancouver · BC" },
  { country: "canada", text: "Calgary · AB" },
  { country: "canada", text: "Montreal · QC" },
  { country: "new_zealand", text: "Auckland" },
  { country: "new_zealand", text: "Wellington" },
  { country: "new_zealand", text: "Christchurch" },
  { country: "japan", text: "Tokyo" },
  { country: "japan", text: "Osaka" },
  { country: "japan", text: "Nagoya" },
  { country: "japan", text: "Yokohama" },
  { country: "south_korea", text: "Seoul" },
  { country: "south_korea", text: "Busan" },
  { country: "south_korea", text: "Incheon" },
  { country: "uk", text: "London" },
  { country: "uk", text: "Manchester" },
  { country: "uk", text: "Birmingham" },
  { country: "germany", text: "Berlin" },
  { country: "germany", text: "Munich" },
  { country: "germany", text: "Hamburg" },
  { country: "germany", text: "Frankfurt" },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState(true);
  const [loaded, setLoaded] = useState<boolean[]>(() =>
    SLIDE_CONFIG.map(() => false),
  );
  const navigate = useNavigate();
  const { t } = useT();
  const h = t("home");

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDE_CONFIG.length),
    [],
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + SLIDE_CONFIG.length) % SLIDE_CONFIG.length);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(next, 9000);
    return () => clearInterval(timer);
  }, [next, playing]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
  };

  const config = SLIDE_CONFIG[current];
  const slide = h.slides[current];

  const slideTitle = slide.title;
  const slideTitleAccent = slide.titleAccent;
  const slideSubtitle = slide.subtitle;
  const slideBadge = slide.badge;
  const hiringText = h.hiring;

  return (
    <section className={s.section}>
      {/* Background images with crossfade */}
      {SLIDE_CONFIG.map((sl, i) => (
        <div
          key={i}
          className={s.slideLayer}
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={sl.image}
            alt={sl.imageAlt}
            className={s.slideImg}
            onLoad={() =>
              setLoaded((prev) => {
                const n = [...prev];
                n[i] = true;
                return n;
              })
            }
            style={{
              display: loaded[i] ? "block" : "none",
              animation: `${KB_VARIANTS[i].animationName} 12s ease-in-out infinite alternate`,
              transformOrigin: KB_VARIANTS[i].transformOrigin,
              willChange: "transform",
            }}
          />
          {!loaded[i] && <div className={s.placeholder} />}
        </div>
      ))}

      {/* Overlay - Giữ nguyên màng đen nhẹ để nổi bật chữ Trắng */}
      <div
        className={s.overlayGradient}
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.05) 100%)",
        }}
      />

      {/* Grain texture */}
      <div
        className={s.grain}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Accent glow */}
      <div
        className={s.accentGlow}
        style={{ background: config.accent, opacity: 0.15 }}
      />

      {/* Main content */}
      <div className={s.main}>
        <div className={s.inner}>
          <div className={s.narrow}>
            {/* Badge */}
            <div
              className={s.badgeRow}
              style={{
                background: `${config.accent}20`,
                borderColor: `${config.accent}50`,
              }}
            >
              <span className={s.badgeText} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                <CountryFlag country={config.ctaLink.split("country=")[1] || "australia"} />
                {slideBadge.replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "").trim()}
              </span>
              <span className={s.badgeDot} />
              <span className={s.badgeHiring}>{hiringText}</span>
            </div>

            {/* Headline */}
            <h1
              className={s.headline}
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 3.75rem)" }}
            >
              <span style={{ color: "#ffffff", display: "block" }}>{slideTitle}</span>
              <span
                style={{
                  color: config.accent,
                  display: "block",
                  textShadow: `0 0 30px ${config.accent}40`,
                }}
              >
                {slideTitleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={s.subtitle}
              style={{
                animationDelay: "0.1s",
                animation:
                  "bounceInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards",
              }}
            >
              {slideSubtitle}
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className={clsx(s.searchForm, s.searchFormAnim)}
              style={{ animationDelay: "0.2s" }}
            >
              <div className={s.inputWrap}>
                <Search size={18} className={s.searchIcon} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={h.heroSearch}
                  className={s.searchInput}
                />
              </div>
              <button type="submit" className={clsx("btn-primary", s.btnSearch)}>
                {h.heroSearchBtn}
              </button>
              <Link to="/jobs" className={s.linkViewAll}>
                <Briefcase size={16} /> {h.heroViewAll}
              </Link>
            </form>

            {/* Quick category filters */}
            <div className={s.categories} style={{ animationDelay: "0.25s" }}>
              {h.heroCategories.map((cat: string) => (
                <Link
                  key={cat}
                  to={`/jobs?search=${cat.split(" ").slice(1).join(" ")}`}
                  className={s.catLink}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div className={s.stats} style={{ animationDelay: "0.3s" }}>
              {slide.statsValues.map((val: string, i: number) => (
                <div key={i}>
                  <p className={s.statValue} style={{ color: config.accent }}>
                    {val}
                  </p>
                  <p className={s.statLabel}>{slide.statsLabels[i]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide index top-right */}
      <div className={s.slideIndex}>
        <span className={s.slideIndexCurrent} style={{ color: config.accent }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className={s.slideIndexSep}>/</span>
        <span className={s.slideIndexTotal}>
          {String(SLIDE_CONFIG.length).padStart(2, "0")}
        </span>
      </div>

      {/* Country switcher (desktop right) */}
      <div className={s.countryRail}>
        {SLIDE_CONFIG.map((sl, i) => {
          const slideCountry = sl.ctaLink.split("country=")[1] || "australia";
          const badgeText = h.slides[i].badge.replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "").split(" ")[0];
          return (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={clsx(s.countryBtn, i === current && s.countryBtnActive)}
              style={
                i === current
                  ? {
                      borderColor: `${sl.accent}80`,
                      background: `${sl.accent}30`,
                      color: "#fff",
                    }
                  : {}
              }
            >
              <CountryFlag country={slideCountry} style={{ marginRight: "0.25rem" }} />
              {badgeText}
            </button>
          );
        })}
      </div>

      {/* Bottom controls */}
      <div className={s.bottomBar}>
        <button type="button" onClick={prev} className={s.navBtn}>
          <ChevronLeft size={18} />
        </button>
        <div className={s.dots}>
          {SLIDE_CONFIG.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={s.dot}
              style={{
                width: i === current ? "2.5rem" : "0.5rem",
                background:
                  i === current ? config.accent : "rgba(255,255,255,0.3)",
                boxShadow:
                  i === current ? `0 0 10px ${config.accent}80` : "none",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className={s.navBtn}
        >
          {playing ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className={s.playIconNudge} />
          )}
        </button>
        <button type="button" onClick={next} className={s.navBtn}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Location ticker */}
      <div className={s.tickerBar}>
        <div className="ticker-wrap">
          <div className={clsx("ticker-content", s.tickerInner)}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className={s.tickerItem} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <MapPin size={11} style={{ color: config.accent }} />
                <CountryFlag country={item.country} style={{ width: "1rem", height: "auto" }} />
                <span>{item.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceInUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
