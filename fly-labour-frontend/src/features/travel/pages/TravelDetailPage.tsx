import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plane,
  ArrowLeft,
  Calendar,
  Wallet,
  Route,
  Users,
  CheckCircle2,
  XCircle,
  Star,
  Globe,
  Phone,
  User,
  MessageSquare,
  Loader2,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { newsApi, contactApi, getImageUrl } from "@core/services/api";
import type { News } from "@core/types";
import { useT } from "@core/hooks/useT";
import CountryFlag from "@components/widgets/CountryFlag";
import toast from "react-hot-toast";
import s from "./TravelDetailPage.module.scss";

// ── Helpers ──────────────────────────────────────────────────────────────────
const COUNTRY_NAMES: Record<string, { vi: string; en: string }> = {
  south_korea: { vi: "Hàn Quốc", en: "South Korea" },
  japan:       { vi: "Nhật Bản", en: "Japan" },
  australia:   { vi: "Úc",       en: "Australia" },
  europe:      { vi: "Châu Âu",  en: "Europe" },
  singapore:   { vi: "Singapore",en: "Singapore" },
  taiwan:      { vi: "Đài Loan", en: "Taiwan" },
  germany:     { vi: "Đức",      en: "Germany" },
  canada:      { vi: "Canada",   en: "Canada" },
  us:          { vi: "Mỹ",       en: "USA" },
  uk:          { vi: "Anh",      en: "UK" },
};

function formatMoney(from?: number, to?: number, currency = "VND", lang = "vi") {
  if (!from && !to) return lang === "en" ? "Contact for price" : "Liên hệ báo giá";
  const fmt = new Intl.NumberFormat("vi-VN");
  if (from && to) return `${fmt.format(from)} – ${fmt.format(to)} ${currency}`;
  return `${fmt.format(from || to || 0)} ${currency}`;
}

// Parse "Ngày 1: Seoul ... | Ngày 2: ..." hoặc dấu " - " thành array
function parseItinerary(raw?: string): string[] {
  if (!raw) return [];
  // Tách bằng dấu "\n", "|", hoặc " - " tối đa
  const lines = raw
    .split(/\n|\|/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length > 1) return lines;
  // Thử tách bằng " - "
  return raw.split(" - ").map((l) => l.trim()).filter(Boolean);
}

// ── Consultation Modal ────────────────────────────────────────────────────────
interface ModalProps {
  tour: News;
  lang: string;
  onClose: () => void;
}

function TravelConsultModal({ tour, lang, onClose }: ModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    departureDate: "",
    adults: "2",
    children: "0",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  const setField = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!form.phone.trim()) return toast.error("Vui lòng nhập số điện thoại");
    if (!form.departureDate) return toast.error("Vui lòng chọn ngày khởi hành dự kiến");
    setSaving(true);
    try {
      const message = [
        `[Đăng ký tư vấn tour] ${tour.title}`,
        `Ngày khởi hành dự kiến: ${form.departureDate}`,
        `Số người: ${form.adults} người lớn, ${form.children} trẻ em`,
        form.note ? `Ghi chú: ${form.note}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      await contactApi.send({
        name: form.fullName,
        email: form.email || "not-provided@fly-labour.vn",
        phone: form.phone,
        message,
      });
      toast.success(
        lang === "en"
          ? "Your consultation request has been sent! We'll contact you soon."
          : "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất."
      );
      onClose();
    } catch {
      toast.error(lang === "en" ? "Failed to send. Please try again." : "Gửi thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 bg-slate-50 transition-all";

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={s.modalHeader}>
          <div>
            <p className={s.modalSub}>{lang === "en" ? "Tour consultation" : "Đăng ký tư vấn"}</p>
            <h3 className={s.modalTitle}>{tour.title}</h3>
          </div>
          <button onClick={onClose} className={s.closeBtn}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className={s.modalForm}>
          {/* Date + pax */}
          <div className={s.formGrid2}>
            <div className={s.formGroup}>
              <label className={s.label}>
                <Calendar size={13} />
                {lang === "en" ? "Departure date *" : "Ngày khởi hành dự kiến *"}
              </label>
              <input
                type="date"
                value={form.departureDate}
                onChange={setField("departureDate")}
                className={inputCls}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className={s.formGrid2} style={{ gap: "0.5rem" }}>
              <div className={s.formGroup}>
                <label className={s.label}>
                  <Users size={13} />
                  {lang === "en" ? "Adults" : "Người lớn"}
                </label>
                <select value={form.adults} onChange={setField("adults")} className={inputCls}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>
                  <Users size={13} />
                  {lang === "en" ? "Children" : "Trẻ em"}
                </label>
                <select value={form.children} onChange={setField("children")} className={inputCls}>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Name + Phone */}
          <div className={s.formGrid2}>
            <div className={s.formGroup}>
              <label className={s.label}>
                <User size={13} />
                {lang === "en" ? "Full name *" : "Họ và tên *"}
              </label>
              <input
                value={form.fullName}
                onChange={setField("fullName")}
                className={inputCls}
                placeholder={lang === "en" ? "Your full name" : "Nguyễn Văn A"}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label}>
                <Phone size={13} />
                {lang === "en" ? "Phone number *" : "Số điện thoại *"}
              </label>
              <input
                value={form.phone}
                onChange={setField("phone")}
                className={inputCls}
                placeholder="0901 234 567"
                type="tel"
              />
            </div>
          </div>

          {/* Email */}
          <div className={s.formGroup}>
            <label className={s.label}>
              <Globe size={13} />
              {lang === "en" ? "Email (optional)" : "Email (không bắt buộc)"}
            </label>
            <input
              value={form.email}
              onChange={setField("email")}
              className={inputCls}
              placeholder="email@example.com"
              type="email"
            />
          </div>

          {/* Note */}
          <div className={s.formGroup}>
            <label className={s.label}>
              <MessageSquare size={13} />
              {lang === "en" ? "Notes / Special requests" : "Ghi chú / Yêu cầu đặc biệt"}
            </label>
            <textarea
              value={form.note}
              onChange={setField("note")}
              className={`${inputCls} h-24 py-3 resize-none`}
              placeholder={
                lang === "en"
                  ? "Dietary requirements, accessibility needs..."
                  : "Yêu cầu ăn kiêng, phòng riêng, trẻ em nhỏ..."
              }
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving} className={s.submitBtn}>
            {saving && <Loader2 className="animate-spin" size={18} />}
            {saving
              ? lang === "en" ? "Sending..." : "Đang gửi..."
              : lang === "en" ? "Send consultation request" : "Gửi đăng ký tư vấn"}
          </button>

          <p className={s.disclaimer}>
            {lang === "en"
              ? "We'll contact you within 24 hours during business hours."
              : "Chúng tôi sẽ liên hệ trong vòng 24 giờ trong giờ làm việc."}
          </p>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TravelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useT();
  const [tour, setTour] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    newsApi
      .getOne(slug)
      .then((r) => setTour(r.data))
      .catch(() => setTour(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className={s.loadingScreen}>
        <Loader2 className="animate-spin text-amber-500" size={40} />
        <p>{lang === "en" ? "Loading tour details..." : "Đang tải thông tin tour..."}</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className={s.notFound}>
        <Plane size={48} className="text-slate-300 mx-auto mb-4" />
        <h2>{lang === "en" ? "Tour not found" : "Không tìm thấy tour này"}</h2>
        <Link to="/travel" className={s.backLink}>
          <ArrowLeft size={16} /> {lang === "en" ? "Back to travel" : "Quay lại du lịch"}
        </Link>
      </div>
    );
  }

  const countryInfo = tour.country ? COUNTRY_NAMES[tour.country] : null;
  const countryLabel = countryInfo
    ? lang === "en" ? countryInfo.en : countryInfo.vi
    : tour.country || "";
  const itinerarySteps = parseItinerary(tour.itinerary);

  // Detect duration from title (e.g., "5N4Đ" → "5 ngày 4 đêm")
  const durationMatch = tour.title.match(/(\d+)N(\d+)Đ/i);
  const duration = durationMatch
    ? lang === "en"
      ? `${durationMatch[1]} days ${durationMatch[2]} nights`
      : `${durationMatch[1]} ngày ${durationMatch[2]} đêm`
    : null;

  return (
    <div className={s.page}>
      {/* ── Breadcrumb ── */}
      <div className={s.breadcrumb}>
        <div className={s.breadcrumbInner}>
          <Link to="/" className={s.breadLink}>{lang === "en" ? "Home" : "Trang chủ"}</Link>
          <span className={s.breadSep}>›</span>
          <Link to="/travel" className={s.breadLink}>{lang === "en" ? "Travel" : "Du lịch"}</Link>
          <span className={s.breadSep}>›</span>
          <span className={s.breadCurrent}>{tour.title}</span>
        </div>
      </div>

      {/* ── Hero image ── */}
      <div className={s.hero}>
        {tour.image ? (
          <img src={getImageUrl(tour.image)} alt={tour.title} className={s.heroImg} />
        ) : (
          <div className={s.heroPlaceholder}>
            <Plane size={60} className="text-white/30" />
          </div>
        )}
        <div className={s.heroOverlay} />

        {/* Badges on hero */}
        <div className={s.heroBadges}>
          {tour.country && (
            <span className={s.countryBadge}>
              <CountryFlag country={tour.country} style={{ width: "1.25rem", height: "auto" }} />
              {countryLabel}
            </span>
          )}
          {duration && (
            <span className={s.durationBadge}>
              <Clock size={13} /> {duration}
            </span>
          )}
        </div>

        {/* Hero title */}
        <div className={s.heroContent}>
          <Link to="/travel" className={s.backBtn}>
            <ArrowLeft size={16} />
            {lang === "en" ? "All tours" : "Tất cả tour"}
          </Link>
          <h1 className={s.heroTitle}>{tour.title}</h1>
          {tour.excerpt && <p className={s.heroExcerpt}>{tour.excerpt}</p>}
        </div>
      </div>

      {/* ── Body ── */}
      <div className={s.body}>
        <div className={s.container}>
          {/* ── Left: main content ── */}
          <main className={s.main}>
            {/* Quick info row */}
            <div className={s.quickInfo}>
              <div className={s.quickItem}>
                <Wallet size={18} className="text-amber-600" />
                <div>
                  <p className={s.quickLabel}>{lang === "en" ? "Price" : "Bảng giá"}</p>
                  <p className={s.quickValue}>
                    {formatMoney(tour.priceFrom, tour.priceTo, tour.priceCurrency || "VND", lang)}
                  </p>
                </div>
              </div>

              {tour.country && (
                <div className={s.quickItem}>
                  <MapPin size={18} className="text-blue-600" />
                  <div>
                    <p className={s.quickLabel}>{lang === "en" ? "Destination" : "Điểm đến"}</p>
                    <p className={s.quickValue}>{countryLabel}</p>
                  </div>
                </div>
              )}

              {duration && (
                <div className={s.quickItem}>
                  <Clock size={18} className="text-emerald-600" />
                  <div>
                    <p className={s.quickLabel}>{lang === "en" ? "Duration" : "Thời gian"}</p>
                    <p className={s.quickValue}>{duration}</p>
                  </div>
                </div>
              )}

              <div className={s.quickItem}>
                <Star size={18} className="text-purple-600" />
                <div>
                  <p className={s.quickLabel}>{lang === "en" ? "Rating" : "Đánh giá"}</p>
                  <p className={s.quickValue}>4.8 / 5 ⭐</p>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            {itinerarySteps.length > 0 && (
              <section className={s.section}>
                <h2 className={s.sectionTitle}>
                  <Route size={20} className="text-amber-600" />
                  {lang === "en" ? "Tour Itinerary" : "Lộ trình tour"}
                </h2>
                <div className={s.itinerary}>
                  {itinerarySteps.map((step, i) => (
                    <div key={i} className={s.itineraryStep}>
                      <div className={s.itineraryDot}>
                        <span className={s.itineraryNum}>{i + 1}</span>
                      </div>
                      <div className={s.itineraryContent}>
                        <p className={s.itineraryText}>{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rich content */}
            {tour.content && (
              <section className={s.section}>
                <h2 className={s.sectionTitle}>
                  <Plane size={20} className="text-amber-600" />
                  {lang === "en" ? "Tour Details" : "Thông tin chi tiết"}
                </h2>
                <div
                  className={s.richContent}
                  dangerouslySetInnerHTML={{ __html: tour.content }}
                />
              </section>
            )}

            {/* What's included / not included */}
            <section className={s.section}>
              <h2 className={s.sectionTitle}>
                <CheckCircle2 size={20} className="text-emerald-600" />
                {lang === "en" ? "Tour includes / excludes" : "Bao gồm / Không bao gồm"}
              </h2>
              <div className={s.inclusionGrid}>
                <div className={s.inclusionCard}>
                  <h4 className={s.inclusionTitle} style={{ color: "#059669" }}>
                    <CheckCircle2 size={16} />
                    {lang === "en" ? "Included" : "Bao gồm"}
                  </h4>
                  <ul className={s.inclusionList}>
                    {[
                      lang === "en" ? "Round-trip airfare" : "Vé máy bay khứ hồi",
                      lang === "en" ? "3-4 star hotel (twin/double)" : "Khách sạn 3-4 sao (phòng đôi/twin)",
                      lang === "en" ? "Meals per program" : "Ăn uống theo chương trình",
                      lang === "en" ? "Private coach transfers" : "Xe chuyên dụng đưa đón",
                      lang === "en" ? "Entrance tickets to attractions" : "Vé tham quan các điểm chính",
                      lang === "en" ? "Vietnamese-speaking guide" : "Hướng dẫn viên tiếng Việt",
                      lang === "en" ? "Travel insurance" : "Bảo hiểm du lịch",
                    ].map((item, i) => (
                      <li key={i} className={s.inclusionItem}>
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.inclusionCard}>
                  <h4 className={s.inclusionTitle} style={{ color: "#dc2626" }}>
                    <XCircle size={16} />
                    {lang === "en" ? "Not included" : "Không bao gồm"}
                  </h4>
                  <ul className={s.inclusionList}>
                    {[
                      lang === "en" ? "Visa fees (if applicable)" : "Phí visa (nếu có)",
                      lang === "en" ? "Personal expenses / shopping" : "Chi tiêu cá nhân / mua sắm",
                      lang === "en" ? "Optional excursions" : "Tour tự chọn thêm",
                      lang === "en" ? "Tips for guide & driver" : "Tiền tips cho HDV & tài xế",
                      lang === "en" ? "Meals outside program" : "Ăn uống ngoài chương trình",
                    ].map((item, i) => (
                      <li key={i} className={s.inclusionItem}>
                        <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </main>

          {/* ── Right: sticky sidebar ── */}
          <aside className={s.sidebar}>
            <div className={s.sideCard}>
              {/* Price */}
              <div className={s.sidePrice}>
                <p className={s.sidePriceLabel}>
                  {lang === "en" ? "Tour price from" : "Giá tour từ"}
                </p>
                <p className={s.sidePriceValue}>
                  {tour.priceFrom
                    ? new Intl.NumberFormat("vi-VN").format(tour.priceFrom)
                    : lang === "en" ? "Contact" : "Liên hệ"}
                </p>
                {tour.priceFrom && (
                  <p className={s.sidePriceCurrency}>
                    {tour.priceCurrency || "VND"} / {lang === "en" ? "person" : "người"}
                  </p>
                )}
              </div>

              {/* Key info */}
              <div className={s.sideInfo}>
                {tour.country && (
                  <div className={s.sideInfoRow}>
                    <MapPin size={15} className="text-amber-600" />
                    <span>{countryLabel}</span>
                  </div>
                )}
                {duration && (
                  <div className={s.sideInfoRow}>
                    <Clock size={15} className="text-amber-600" />
                    <span>{duration}</span>
                  </div>
                )}
                <div className={s.sideInfoRow}>
                  <Users size={15} className="text-amber-600" />
                  <span>{lang === "en" ? "Min. 2 persons" : "Tối thiểu 2 người"}</span>
                </div>
                <div className={s.sideInfoRow}>
                  <Star size={15} className="text-amber-600" />
                  <span>{lang === "en" ? "4.8/5 rating" : "Đánh giá 4.8/5"}</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowModal(true)}
                className={s.ctaBtn}
              >
                <Calendar size={18} />
                {lang === "en" ? "Book consultation" : "Đăng ký tư vấn ngay"}
              </button>

              {/* External register link */}
              {tour.registerUrl && (
                <a
                  href={tour.registerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={s.ctaOutline}
                >
                  <Plane size={16} />
                  {lang === "en" ? "Register directly" : "Đăng ký trực tiếp"}
                </a>
              )}

              {/* Hotline */}
              <div className={s.hotline}>
                <Phone size={14} />
                <div>
                  <p className={s.hotlineLabel}>{lang === "en" ? "Hotline" : "Hotline tư vấn"}</p>
                  <a href="tel:+84901234567" className={s.hotlineNumber}>0901 234 567</a>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className={s.trustBadges}>
              {[
                { icon: "🔒", label: lang === "en" ? "Secure booking" : "Đặt tour an toàn" },
                { icon: "✈️", label: lang === "en" ? "Licensed tour operator" : "Có giấy phép kinh doanh" },
                { icon: "💬", label: lang === "en" ? "24/7 support" : "Hỗ trợ 24/7" },
              ].map((b, i) => (
                <div key={i} className={s.trustItem}>
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Consultation Modal ── */}
      {showModal && tour && (
        <TravelConsultModal
          tour={tour}
          lang={lang}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
