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
import { useT } from "@/core/hooks/useT";

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
  "🇦🇺 Sydney · NSW",
  "🇦🇺 Melbourne · VIC",
  "🇦🇺 Brisbane · QLD",
  "🇦🇺 Perth · WA",
  "🇦🇺 Adelaide · SA",
  "🇨🇦 Toronto · ON",
  "🇨🇦 Vancouver · BC",
  "🇨🇦 Calgary · AB",
  "🇨🇦 Montreal · QC",
  "🇳🇿 Auckland",
  "🇳🇿 Wellington",
  "🇳🇿 Christchurch",
  "🇯🇵 Tokyo",
  "🇯🇵 Osaka",
  "🇯🇵 Nagoya",
  "🇯🇵 Yokohama",
  "🇰🇷 Seoul",
  "🇰🇷 Busan",
  "🇰🇷 Incheon",
  "🇬🇧 London",
  "🇬🇧 Manchester",
  "🇬🇧 Birmingham",
  "🇩🇪 Berlin",
  "🇩🇪 Munich",
  "🇩🇪 Hamburg",
  "🇩🇪 Frankfurt",
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
    <section className="hero-banner relative min-h-screen flex flex-col overflow-hidden bg-slate-900 dark:bg-brand-dark">
      {/* Background images with crossfade */}
      {SLIDE_CONFIG.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={s.image}
            alt={s.imageAlt}
            className="w-full h-full object-cover"
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
          {!loaded[i] && (
            <div className="w-full h-full bg-slate-800 dark:bg-brand-dark animate-pulse" />
          )}
        </div>
      ))}

      {/* Overlay - Giữ nguyên màng đen nhẹ để nổi bật chữ Trắng */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.2) 50%, rgba(10,10,10,0.05) 100%)",
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl z-10 pointer-events-none transition-all duration-1000"
        style={{ background: config.accent, opacity: 0.15 }}
      />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20">
          <div className="max-w-6xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border animate-fade-up backdrop-blur-md"
              style={{
                background: `${config.accent}20`,
                borderColor: `${config.accent}50`,
              }}
            >
              <span className="text-sm font-medium text-white">{slideBadge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="text-xs text-green-300 font-bold tracking-wide">{hiringText}</span>
            </div>

            {/* Headline */}
            <h1
              className="font-display tracking-wide leading-tight mb-4 animate-slide-in drop-shadow-lg"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
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
              className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed drop-shadow-md"
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
              className="flex gap-3 mb-8 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-1 relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={h.heroSearch}
                  className="pl-12 pr-4 h-14 text-sm w-full rounded-xl outline-none transition-all duration-300 focus:bg-white/25"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-sm px-7 h-14 whitespace-nowrap font-semibold shadow-lg"
              >
                {h.heroSearchBtn}
              </button>
              <Link
                to="/jobs"
                className="text-sm px-5 h-14 flex items-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 hover:bg-white/25"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff",
                }}
              >
                <Briefcase size={16} /> {h.heroViewAll}
              </Link>
            </form>

            {/* Quick category filters */}
            <div
              className="flex flex-wrap gap-2 mb-10 animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              {h.heroCategories.map((cat: string) => (
                <Link
                  key={cat}
                  to={`/jobs?search=${cat.split(" ").slice(1).join(" ")}`}
                  className="text-xs px-4 py-2 bg-white/10 hover:bg-white/25 border border-white/20 hover:border-white/50 rounded-full text-white/90 hover:text-white transition-all duration-300 backdrop-blur-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-10 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              {slide.statsValues.map((val: string, i: number) => (
                <div key={i}>
                  <p
                    className="font-display text-4xl md:text-5xl font-bold drop-shadow-sm"
                    style={{ color: config.accent }}
                  >
                    {val}
                  </p>
                  <p className="text-white/80 text-sm mt-1 font-medium tracking-wide">
                    {slide.statsLabels[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide index top-right */}
      <div className="absolute top-24 right-8 z-20 hidden lg:flex items-baseline gap-1 drop-shadow-lg">
        <span
          className="font-display text-4xl font-bold"
          style={{ color: config.accent }}
        >
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/30 text-lg mx-1">/</span>
        <span className="font-display text-xl text-white/40 font-semibold">
          {String(SLIDE_CONFIG.length).padStart(2, "0")}
        </span>
      </div>

      {/* Country switcher (desktop right) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2.5 z-20">
        {SLIDE_CONFIG.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-md ${
              i === current
                ? "text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-white/60 border-white/10 bg-white/5 hover:bg-white/20 hover:border-white/30 hover:text-white"
            }`}
            style={
              i === current
                ? {
                    borderColor: `${s.accent}80`,
                    background: `${s.accent}30`,
                    color: "#fff",
                  }
                : {}
            }
          >
            {h.slides[i].badge.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2.5 items-center px-2">
          {SLIDE_CONFIG.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all duration-500 ease-out"
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
          onClick={() => setPlaying((p) => !p)}
          className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          {playing ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        <button
          onClick={next}
          className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Location ticker */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md border-t border-white/10 py-3">
        <div className="ticker-wrap">
          <div className="ticker-content text-[13px] text-white/80 font-medium tracking-wide">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((loc, i) => (
              <span key={i} className="inline-flex items-center gap-2 mr-10">
                <MapPin size={11} style={{ color: config.accent }} />
                <span>{loc}</span>
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
