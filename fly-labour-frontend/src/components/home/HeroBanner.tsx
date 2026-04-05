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
import { useT } from "@/hooks/useT";
import { EditableText } from "@/components/ui/EditableText";
import { usePageContent } from "@/hooks/usePageContent";

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
    ctaLink: "/jobs?country=south_korea",
    image:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1600&q=80&fit=crop",
    imageAlt: "South Korea Seoul",
    accent: "#4A90D9",
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

const TICKER_ITEMS = [
  "🇦🇺 Sydney · NSW", "🇦🇺 Melbourne · VIC", "🇦🇺 Brisbane · QLD",
  "🇦🇺 Perth · WA", "🇦🇺 Adelaide · SA", "🇨🇦 Toronto · ON",
  "🇨🇦 Vancouver · BC", "🇨🇦 Calgary · AB", "🇨🇦 Montreal · QC",
  "🇳🇿 Auckland", "🇳🇿 Wellington", "🇳🇿 Christchurch",
  "🇯🇵 Tokyo", "🇯🇵 Osaka", "🇯🇵 Nagoya", "🇯🇵 Yokohama",
  "🇰🇷 Seoul", "🇰🇷 Busan", "🇰🇷 Incheon",
  "🇬🇧 London", "🇬🇧 Manchester", "🇬🇧 Birmingham",
  "🇩🇪 Berlin", "🇩🇪 Munich", "🇩🇪 Hamburg", "🇩🇪 Frankfurt",
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

  // Dùng usePageContent để lấy override từ DB (nếu có)
  const slideTitle = usePageContent(`hero.slide.${current}.title`, slide.title);
  const slideTitleAccent = usePageContent(`hero.slide.${current}.titleAccent`, slide.titleAccent);
  const slideSubtitle = usePageContent(`hero.slide.${current}.subtitle`, slide.subtitle);
  const slideBadge = usePageContent(`hero.slide.${current}.badge`, slide.badge);
  const hiringText = usePageContent('hero.hiring', h.hiring);

  return (
    <section className="hero-banner relative min-h-screen flex flex-col overflow-hidden">
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
            className={`w-full h-full object-cover ${i === current ? "animate-ken-burns" : ""}`}
            onLoad={() =>
              setLoaded((prev) => {
                const n = [...prev];
                n[i] = true;
                return n;
              })
            }
            style={{ display: loaded[i] ? "block" : "none" }}
          />
          {!loaded[i] && (
            <div className="w-full h-full bg-gradient-to-br from-brand-card to-brand-dark animate-pulse" />
          )}
        </div>
      ))}

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.15) 50%, rgba(10,10,10,0.05) 100%)",
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
        style={{ background: config.accent, opacity: 0.07 }}
      />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20">
          <div className="max-w-6xl">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border animate-fade-up"
              style={{
                background: `${config.accent}18`,
                borderColor: `${config.accent}40`,
              }}
            >
              <span className="text-sm text-white">
                <EditableText
                  settingKey={`hero.slide.${current}.badge`}
                  defaultValue={slideBadge}
                />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">
                <EditableText
                  settingKey="hero.hiring"
                  defaultValue={hiringText}
                />
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display tracking-wide leading-tight mb-4 animate-slide-in"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
            >
              <span style={{ color: "#ffffff", display: "block" }}>
                <EditableText
                  settingKey={`hero.slide.${current}.title`}
                  defaultValue={slideTitle}
                />
              </span>
              <span style={{ color: config.accent, display: "block" }}>
                <EditableText
                  settingKey={`hero.slide.${current}.titleAccent`}
                  defaultValue={slideTitleAccent}
                />
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-white text-lg mb-8 max-w-xl leading-relaxed"
              style={{
                animationDelay: "0.1s",
                color: "#ffffff",
                animation: "bounceInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards",
              }}
            >
              <EditableText
                settingKey={`hero.slide.${current}.subtitle`}
                defaultValue={slideSubtitle}
                multiline
              />
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex gap-2 mb-8 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-1 relative max-w-md">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={h.heroSearch}
                  className="pl-11 h-12 text-sm w-full rounded-xl outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(8px)",
                    border: "1.5px solid rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
              <button type="submit" className="btn-primary text-sm px-6 h-12 whitespace-nowrap">
                {h.heroSearchBtn}
              </button>
              <Link
                to="/jobs"
                className="text-sm px-4 h-12 flex items-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  color: "#fff",
                }}
              >
                <Briefcase size={14} /> {h.heroViewAll}
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
                  className="text-xs px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/50 rounded-full text-white hover:text-white transition-all duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-8 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              {slide.statsValues.map((val: string, i: number) => (
                <div key={i}>
                  <p className="font-display text-4xl" style={{ color: config.accent }}>
                    <EditableText
                      settingKey={`hero.slide.${current}.stat.${i}.value`}
                      defaultValue={val}
                    />
                  </p>
                  <p className="text-white text-xs mt-0.5">
                    <EditableText
                      settingKey={`hero.slide.${current}.stat.${i}.label`}
                      defaultValue={slide.statsLabels[i]}
                    />
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Slide index top-right */}
      <div className="absolute top-24 right-8 z-20 hidden lg:flex items-baseline gap-1">
        <span className="font-display text-4xl" style={{ color: config.accent }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/20 text-lg mx-1">/</span>
        <span className="font-display text-xl text-white/20">
          {String(SLIDE_CONFIG.length).padStart(2, "0")}
        </span>
      </div>

      {/* Country switcher (desktop right) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2 z-20">
        {SLIDE_CONFIG.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`px-3 py-2 rounded-xl text-sm transition-all duration-200 border backdrop-blur-sm ${
              i === current
                ? "text-white"
                : "text-slate-700 dark:text-gray-300 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            }`}
            style={
              i === current
                ? { borderColor: `${s.accent}60`, background: `${s.accent}20`, color: "#fff" }
                : {}
            }
          >
            {h.slides[i].badge.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-xl border border-white/25 bg-white/15 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2 items-center">
          {SLIDE_CONFIG.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-1.5 rounded-full transition-all duration-400"
              style={{
                width: i === current ? "2rem" : "0.5rem",
                background: i === current ? config.accent : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-9 h-9 rounded-xl border border-white/25 bg-white/15 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          {playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          onClick={next}
          className="w-9 h-9 rounded-xl border border-white/25 bg-white/15 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Location ticker */}
      <div className="relative z-20 bg-black/35 backdrop-blur border-t border-white/15 py-2.5">
        <div className="ticker-wrap">
          <div className="ticker-content text-xs text-white/70">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((loc, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 mr-8">
                <MapPin size={9} style={{ color: config.accent }} />
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
