import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Route, Wallet, ArrowRight, Search, SlidersHorizontal, MapPin, Clock } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import type { News } from "@core/types";
import { useT } from "@core/hooks/useT";
import CountryFlag from "@components/widgets/CountryFlag";

const MOCK_TRAVEL_ITEMS: News[] = [
  {
    id: "mock-travel-korea",
    type: "travel",
    title: "Tour Hàn Quốc 5N4Đ - Seoul / Nami / Everland",
    slug: "tour-han-quoc-5n4d",
    excerpt: "Gói phổ thông phù hợp gia đình, lịch trình nhẹ, khách sạn 3-4 sao.",
    content: "Bao gồm vé máy bay khứ hồi, khách sạn, xe đưa đón, vé tham quan chính.",
    image: "https://images.unsplash.com/photo-1538485399081-7c8976f33827?w=1200&q=80&fit=crop",
    isPublished: true,
    country: "south_korea",
    registerUrl: "https://example.com/travel-kr",
    priceFrom: 14900000,
    priceTo: 18900000,
    priceCurrency: "VND",
    itinerary: "Seoul - Nami - Everland - Shopping - Về VN",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-travel-japan",
    type: "travel",
    title: "Tour Nhật Bản 6N5Đ - Tokyo / Fuji / Osaka",
    slug: "tour-nhat-ban-6n5d",
    excerpt: "Lộ trình vàng mùa hoa, tối ưu điểm check-in và mua sắm.",
    content: "Hướng dẫn viên tiếng Việt, ăn theo chương trình, tặng sim data du lịch.",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80&fit=crop",
    isPublished: true,
    country: "japan",
    registerUrl: "https://example.com/travel-jp",
    priceFrom: 28900000,
    priceTo: 35900000,
    priceCurrency: "VND",
    itinerary: "Tokyo - Asakusa - Fuji - Kyoto - Osaka - Kansai",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-travel-australia",
    type: "travel",
    title: "Tour Úc 7N6Đ - Sydney / Melbourne / Blue Mountains",
    slug: "tour-uc-7n6d",
    excerpt: "Hành trình chuẩn premium, phù hợp gia đình và khách muốn trải nghiệm city + thiên nhiên.",
    content: "Bao gồm vé máy bay khứ hồi, khách sạn trung tâm, city tour và hướng dẫn viên tiếng Việt.",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80&fit=crop",
    isPublished: true,
    country: "australia",
    registerUrl: "https://example.com/travel-au",
    priceFrom: 42900000,
    priceTo: 52900000,
    priceCurrency: "VND",
    itinerary: "Sydney - Opera House - Blue Mountains - Melbourne - Great Ocean Road",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-travel-europe",
    type: "travel",
    title: "Tour Châu Âu 10N9Đ - Pháp / Ý / Thụy Sĩ",
    slug: "tour-chau-au-10n9d",
    excerpt: "Lộ trình liên tuyến nổi bật, tối ưu thời gian và chi phí visa Schengen.",
    content: "Khách sạn 4 sao, xe di chuyển liên quốc gia, hỗ trợ thủ tục visa đầy đủ.",
    image: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&q=80&fit=crop",
    isPublished: true,
    country: "europe",
    registerUrl: "https://example.com/travel-eu",
    priceFrom: 69900000,
    priceTo: 89900000,
    priceCurrency: "VND",
    itinerary: "Paris - Lucerne - Interlaken - Milan - Venice - Rome",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-travel-singapore",
    type: "travel",
    title: "Tour Singapore 4N3Đ - Sentosa / Marina Bay",
    slug: "tour-singapore-4n3d",
    excerpt: "Tour ngắn ngày, lịch trình nhẹ phù hợp gia đình có trẻ nhỏ.",
    content: "Combo vé tham quan Universal Studios + city tour + hỗ trợ hoàn thuế mua sắm.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80&fit=crop",
    isPublished: true,
    country: "singapore",
    registerUrl: "https://example.com/travel-sg",
    priceFrom: 15900000,
    priceTo: 21900000,
    priceCurrency: "VND",
    itinerary: "Marina Bay - Gardens by the Bay - Sentosa - Universal Studios",
    createdAt: new Date().toISOString(),
  },
];

const COUNTRY_NAMES: Record<string, { vi: string; en: string }> = {
  south_korea: { vi: "Hàn Quốc",  en: "South Korea" },
  japan:       { vi: "Nhật Bản",  en: "Japan" },
  australia:   { vi: "Úc",        en: "Australia" },
  europe:      { vi: "Châu Âu",   en: "Europe" },
  singapore:   { vi: "Singapore", en: "Singapore" },
  taiwan:      { vi: "Đài Loan",  en: "Taiwan" },
  germany:     { vi: "Đức",       en: "Germany" },
  canada:      { vi: "Canada",    en: "Canada" },
  us:          { vi: "Mỹ",        en: "USA" },
  uk:          { vi: "Anh",       en: "UK" },
};

function formatMoney(from?: number, to?: number, currency = "VND", lang = "vi") {
  if (!from && !to) return lang === "en" ? "Contact" : "Liên hệ";
  const fmt = new Intl.NumberFormat("vi-VN");
  if (from && to) return `${fmt.format(from)} – ${fmt.format(to)} ${currency}`;
  return `${fmt.format(from || to || 0)} ${currency}`;
}

export default function TravelPage() {
  const { lang } = useT();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [destination, setDestination] = useState("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "under-20" | "20-50" | "over-50">("all");

  useEffect(() => {
    setLoading(true);
    newsApi
      .getAllTravel()
      .then((r) => {
        const data = r.data || [];
        setItems(data.length > 0 ? data : MOCK_TRAVEL_ITEMS);
      })
      .catch(() => setItems(MOCK_TRAVEL_ITEMS))
      .finally(() => setLoading(false));
  }, []);

  const destinations = useMemo(() => {
    const unique = Array.from(new Set(items.map((x) => x.country).filter(Boolean))) as string[];
    return unique;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((pkg) => {
      const text = `${pkg.title} ${pkg.excerpt || ""} ${pkg.country || ""}`.toLowerCase();
      const matchesSearch = !search.trim() || text.includes(search.trim().toLowerCase());
      const matchesDestination = destination === "all" || pkg.country === destination;

      const minPrice = Number(pkg.priceFrom || pkg.priceTo || 0);
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under-20" && minPrice > 0 && minPrice < 20000000) ||
        (priceFilter === "20-50" && minPrice >= 20000000 && minPrice <= 50000000) ||
        (priceFilter === "over-50" && minPrice > 50000000);

      return matchesSearch && matchesDestination && matchesPrice;
    });
  }, [items, search, destination, priceFilter]);

  const getCountryLabel = (country: string) => {
    const info = COUNTRY_NAMES[country];
    if (!info) return country;
    return lang === "en" ? info.en : info.vi;
  };

  const getDuration = (title: string) => {
    const m = title.match(/(\d+)N(\d+)Đ/i);
    if (!m) return null;
    return lang === "en" ? `${m[1]} days ${m[2]} nights` : `${m[1]} ngày ${m[2]} đêm`;
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "4.5rem", background: "#f8fafc" }}>
      {/* ── Hero header ── */}
      <section style={{ borderBottom: "1px solid #e2e8f0", background: "white" }}>
        <div className="fl-container-7xl" style={{ padding: "2.5rem 1.5rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706" }}>
            {lang === "en" ? "Travel Services" : "Dịch vụ du lịch"}
          </p>
          <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0f172a", marginTop: "0.5rem", lineHeight: 1.2 }}>
            {lang === "en" ? "Tour Packages & Pricing" : "Gói tour du lịch & Bảng giá"}
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            {lang === "en"
              ? "Discover handpicked tours with full itinerary, pricing and consultation."
              : "Khám phá các gói tour được tuyển chọn với lộ trình chi tiết, bảng giá và tư vấn trực tiếp."}
          </p>
        </div>
      </section>

      <div className="fl-container-7xl" style={{ padding: "2rem 1.5rem" }}>
        {/* ── Filters ── */}
        <div style={{
          background: "white", border: "1px solid #e2e8f0", borderRadius: "1.25rem",
          padding: "1.25rem 1.5rem", marginBottom: "1.75rem",
          display: "flex", flexDirection: "column", gap: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 700 }}>
            <SlidersHorizontal size={14} />
            {lang === "en" ? "Filter tours" : "Lọc tour"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "en" ? "Search tour..." : "Tìm tour..."}
                style={{
                  width: "100%", height: "2.75rem", borderRadius: "0.875rem",
                  border: "1px solid #e2e8f0", paddingLeft: "2.25rem", paddingRight: "1rem",
                  fontSize: "0.875rem", outline: "none", background: "#f8fafc", boxSizing: "border-box",
                }}
              />
            </div>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{
                height: "2.75rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0",
                padding: "0 1rem", fontSize: "0.875rem", outline: "none", background: "#f8fafc",
              }}
            >
              <option value="all">{lang === "en" ? "All destinations" : "Tất cả điểm đến"}</option>
              {destinations.map((d) => (
                <option key={d} value={d}>{getCountryLabel(d)}</option>
              ))}
            </select>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              style={{
                height: "2.75rem", borderRadius: "0.875rem", border: "1px solid #e2e8f0",
                padding: "0 1rem", fontSize: "0.875rem", outline: "none", background: "#f8fafc",
              }}
            >
              <option value="all">{lang === "en" ? "All prices" : "Mọi mức giá"}</option>
              <option value="under-20">{lang === "en" ? "Under 20M VND" : "Dưới 20 triệu"}</option>
              <option value="20-50">{lang === "en" ? "20M – 50M VND" : "20 – 50 triệu"}</option>
              <option value="over-50">{lang === "en" ? "Over 50M VND" : "Trên 50 triệu"}</option>
            </select>
          </div>
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                height: "16rem", background: "white", borderRadius: "1.25rem",
                border: "1px solid #e2e8f0", animation: "pulse 2s infinite",
              }} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            background: "white", border: "1px solid #e2e8f0", borderRadius: "1.25rem",
            padding: "4rem", textAlign: "center", color: "#64748b",
          }}>
            <Plane size={40} style={{ margin: "0 auto 1rem", color: "#e2e8f0" }} />
            <p style={{ fontWeight: 600 }}>
              {lang === "en" ? "No tours match your filters." : "Không có tour phù hợp bộ lọc hiện tại."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filteredItems.map((pkg) => {
              const cLabel = pkg.country ? getCountryLabel(pkg.country) : "";
              const duration = getDuration(pkg.title);

              return (
                <article
                  key={pkg.id}
                  style={{
                    background: "white", border: "1px solid #e2e8f0",
                    borderRadius: "1.25rem", overflow: "hidden",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 8px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "280px 1fr" }}>
                    {/* Image */}
                    <div style={{ position: "relative", overflow: "hidden", minHeight: "220px" }}>
                      {pkg.image ? (
                        <img
                          src={getImageUrl(pkg.image)}
                          alt={pkg.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{
                          height: "100%", minHeight: "220px", background: "#f1f5f9",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8",
                        }}>
                          <Plane size={36} />
                        </div>
                      )}
                      {/* Country badge overlay */}
                      {pkg.country && (
                        <div style={{
                          position: "absolute", top: "0.75rem", left: "0.75rem",
                          display: "inline-flex", alignItems: "center", gap: "0.35rem",
                          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
                          color: "white", fontSize: "0.72rem", fontWeight: 700,
                          padding: "0.3rem 0.65rem", borderRadius: "99px",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}>
                          <CountryFlag country={pkg.country} style={{ width: "1rem", height: "auto" }} />
                          {cLabel}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        {/* Duration tag */}
                        {duration && (
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            background: "#fef3c7", color: "#b45309",
                            fontSize: "0.7rem", fontWeight: 700,
                            padding: "0.25rem 0.65rem", borderRadius: "99px",
                            marginBottom: "0.6rem", border: "1px solid #fde68a",
                          }}>
                            <Clock size={11} />
                            {duration}
                          </div>
                        )}

                        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.3, marginBottom: "0.5rem" }}>
                          {pkg.title}
                        </h3>
                        {pkg.excerpt && (
                          <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                            {pkg.excerpt}
                          </p>
                        )}

                        {/* Info grid */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                          <div style={{
                            padding: "0.75rem 1rem", borderRadius: "0.875rem",
                            border: "1px solid #fde68a", background: "#fffbeb",
                          }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#92400e", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <Wallet size={11} /> {lang === "en" ? "Price range" : "Bảng giá"}
                            </p>
                            <p style={{ fontSize: "0.875rem", fontWeight: 800, color: "#78350f", marginTop: "0.2rem" }}>
                              {formatMoney(pkg.priceFrom, pkg.priceTo, pkg.priceCurrency || "VND", lang)}
                            </p>
                          </div>
                          <div style={{
                            padding: "0.75rem 1rem", borderRadius: "0.875rem",
                            border: "1px solid #e2e8f0", background: "#f8fafc",
                          }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <Route size={11} /> {lang === "en" ? "Route" : "Lộ trình"}
                            </p>
                            <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e293b", marginTop: "0.2rem", lineHeight: 1.4 }}>
                              {pkg.itinerary || (lang === "en" ? "Contact for itinerary" : "Liên hệ để nhận lộ trình")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                        <Link
                          to={`/travel/${pkg.slug}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
                            background: "linear-gradient(135deg, #d97706, #f59e0b)",
                            color: "white", fontWeight: 700, fontSize: "0.875rem",
                            textDecoration: "none", transition: "all 0.2s",
                            boxShadow: "0 4px 12px rgba(217,119,6,0.25)",
                          }}
                        >
                          {lang === "en" ? "View details" : "Xem chi tiết"}
                          <ArrowRight size={15} />
                        </Link>

                        {pkg.country && (
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.5rem 1rem", borderRadius: "0.75rem",
                            border: "1px solid #e2e8f0", background: "white",
                            fontSize: "0.8rem", fontWeight: 600, color: "#374151",
                          }}>
                            <MapPin size={13} className="text-amber-600" style={{ color: "#d97706" }} />
                            {cLabel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
