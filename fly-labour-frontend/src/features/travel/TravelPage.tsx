import { useEffect, useMemo, useState } from "react";
import { Plane, Route, Wallet } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import type { News } from "@core/types";
import { useT } from "@core/hooks/useT";

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
    itinerary: "Ngày 1 Seoul - Ngày 2 Nami - Ngày 3 Everland - Ngày 4 Shopping - Ngày 5 Về VN",
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

function formatMoney(from?: number, to?: number, currency = "VND") {
  if (!from && !to) return "-";
  const fmt = new Intl.NumberFormat("vi-VN");
  if (from && to) return `${fmt.format(from)} - ${fmt.format(to)} ${currency}`;
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
    const unique = Array.from(new Set(items.map((x) => x.country).filter(Boolean)));
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

  return (
    <div className="min-h-screen pt-20 fl-surface-page">
      <section className="border-b border-slate-200 bg-white">
        <div className="fl-container-7xl py-10">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-600">
            {lang === "en" ? "Travel Services" : "Du lịch"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            {lang === "en" ? "Travel Packages, Pricing & Itinerary" : "Gói dịch vụ, bảng giá và lộ trình"}
          </h1>
        </div>
      </section>

      <div className="fl-container-7xl py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 mb-6">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "en" ? "Search package..." : "Tìm tour..."}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-amber-400"
            />
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-amber-400 bg-white"
            >
              <option value="all">{lang === "en" ? "All destinations" : "Tất cả điểm đến"}</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value as any)}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-amber-400 bg-white"
            >
              <option value="all">{lang === "en" ? "All prices" : "Mọi mức giá"}</option>
              <option value="under-20">{lang === "en" ? "Under 20M VND" : "Dưới 20 triệu"}</option>
              <option value="20-50">{lang === "en" ? "20M - 50M VND" : "20 - 50 triệu"}</option>
              <option value="over-50">{lang === "en" ? "Over 50M VND" : "Trên 50 triệu"}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            {lang === "en" ? "No package matches your filters." : "Không có tour phù hợp bộ lọc hiện tại."}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((pkg) => (
              <article key={pkg.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-3">
                  <div className="md:col-span-1">
                    {pkg.image ? (
                      <img src={getImageUrl(pkg.image)} alt={pkg.title} className="w-full h-full min-h-[220px] object-cover" />
                    ) : (
                      <div className="h-full min-h-[220px] bg-slate-100 flex items-center justify-center text-slate-400">
                        <Plane size={30} />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 p-6">
                    <h3 className="text-2xl font-bold text-slate-900">{pkg.title}</h3>
                    {pkg.excerpt && <p className="text-slate-600 mt-2">{pkg.excerpt}</p>}
                    {pkg.country && (
                      <p className="mt-2 inline-flex text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                        {lang === "en" ? "Destination" : "Điểm đến"}: {pkg.country}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs uppercase tracking-wider font-bold text-amber-700 inline-flex items-center gap-1">
                          <Wallet size={13} /> {lang === "en" ? "Price range" : "Bảng giá"}
                        </p>
                        <p className="text-sm font-bold text-amber-900 mt-1">
                          {formatMoney(pkg.priceFrom, pkg.priceTo, pkg.priceCurrency || "VND")}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs uppercase tracking-wider font-bold text-slate-600 inline-flex items-center gap-1">
                          <Route size={13} /> {lang === "en" ? "Route / itinerary" : "Lộ trình"}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1 line-clamp-2">
                          {pkg.itinerary || (lang === "en" ? "Contact for details" : "Liên hệ để nhận lộ trình chi tiết")}
                        </p>
                      </div>
                    </div>

                    {pkg.content && (
                      <p className="mt-4 text-sm text-slate-700 whitespace-pre-line">
                        {pkg.content}
                      </p>
                    )}

                    {pkg.registerUrl && (
                      <div className="mt-5">
                        <a
                          href={pkg.registerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex px-4 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold text-sm"
                        >
                          {lang === "en" ? "Book / Consult now" : "Đăng ký tư vấn ngay"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

