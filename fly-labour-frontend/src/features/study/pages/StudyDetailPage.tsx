import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Globe,
  Loader2,
  BookOpen,
  Share2,
  Facebook,
  Twitter,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import type { News } from "@core/types";
import { useT } from "@core/hooks/useT";
import { formatDate } from "@core/utils/helpers";
import StudyApplyModal from "../components/StudyApplyModal";
import toast from "react-hot-toast";
import clsx from "clsx";
import s from "./StudyDetailPage.module.scss";

const COUNTRIES = [
  { value: "australia", label: "🇦🇺 Úc" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "new_zealand", label: "🇳🇿 New Zealand" },
  { value: "germany", label: "🇩🇪 Đức" },
  { value: "us", label: "🇺🇸 Mỹ" },
  { value: "uk", label: "🇬🇧 Anh" },
  { value: "japan", label: "🇯🇵 Nhật Bản" },
  { value: "south_korea", label: "🇰🇷 Hàn Quốc" },
  { value: "singapore", label: "🇸🇬 Singapore" },
  { value: "taiwan", label: "🇹🇼 Đài Loan" },
];

export default function StudyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useT();
  
  const [item, setItem] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    newsApi
      .getOne(slug)
      .then((r) => {
        setItem(r.data);
        document.title = `${r.data.title} — Fly Labour`;

        // Fetch related study articles
        newsApi
          .getAllStudy(r.data.country ? { country: r.data.country } : undefined)
          .then((res) => {
            const list = res.data || [];
            setRelated(list.filter((x: News) => x.id !== r.data.id).slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => {
        setItem(null);
      })
      .finally(() => setLoading(false));

    return () => {
      document.title = "Fly Labour — Du học";
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={s.centerState}>
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className={s.centerState}>
        <div className={s.notFound}>
          <p className={s.notFoundEmoji}>😕</p>
          <p className={s.notFoundText}>
            {lang === "en" ? "Study program not found." : "Không tìm thấy chương trình du học yêu cầu."}
          </p>
          <Link to="/study" className={clsx("btn-primary", s.notFoundBtn)}>
            <ArrowLeft size={16} style={{ marginRight: "0.5rem" }} />
            {lang === "en" ? "Back to list" : "Quay lại danh sách"}
          </Link>
        </div>
      </div>
    );
  }

  const getCountryLabel = (countryVal?: string) => {
    if (!countryVal) return "";
    const match = COUNTRIES.find((c) => c.value === countryVal);
    return match ? match.label : countryVal;
  };

  const formatPrice = (p: News) => {
    if (!p.priceFrom && !p.priceTo) return lang === "en" ? "Contact for details" : "Liên hệ nhận học phí";
    if (p.priceFrom && !p.priceTo) return `${Number(p.priceFrom).toLocaleString()} ${p.priceCurrency || "VND"}`;
    return `${Number(p.priceFrom).toLocaleString()} - ${Number(p.priceTo).toLocaleString()} ${p.priceCurrency || "VND"}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(lang === "en" ? "Copied link to clipboard!" : "Đã sao chép liên kết vào bộ nhớ tạm!");
  };

  return (
    <div className={s.page}>
      {/* Breadcrumb */}
      <div className={s.breadcrumb}>
        <div className={s.breadcrumbInner}>
          <Link to="/" className={s.breadcrumbLink}>
            {lang === "en" ? "Home" : "Trang chủ"}
          </Link>
          <span>/</span>
          <Link to="/study" className={s.breadcrumbLink}>
            {lang === "en" ? "Study Abroad" : "Du học"}
          </Link>
          <span>/</span>
          <span className={s.breadcrumbCurrent}>{item.title}</span>
        </div>
      </div>

      <div className={s.content}>
        <div className={s.layout}>
          <div className={s.mainCol}>
            {/* Header Card */}
            <div className={s.card}>
              <div className={s.heroImgWrap}>
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt={item.title} className={s.heroImg} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-50/50 text-amber-500">
                    <GraduationCap size={72} />
                  </div>
                )}
              </div>

              <div className={s.headerInfo}>
                <div className={s.badgeRow}>
                  <span className={s.countryBadge}>
                    <Globe size={13} />
                    {getCountryLabel(item.country) || (lang === "en" ? "General" : "Tổng quan")}
                  </span>
                  {item.studyType ? (
                    <span className={clsx(
                      s.typeBadge,
                      item.studyType === "university" && s.badgeUni,
                      item.studyType === "college" && s.badgeCol,
                      item.studyType === "vocational" && s.badgeVoc
                    )}>
                      {item.studyType === "university" && "🎓 " + (lang === "en" ? "University" : "Đại học")}
                      {item.studyType === "college" && "🏫 " + (lang === "en" ? "College" : "Cao đẳng")}
                      {item.studyType === "vocational" && "💼 " + (lang === "en" ? "Vocational" : "Du học nghề")}
                    </span>
                  ) : (
                    <span className={s.typeBadge}>
                      {lang === "en" ? "Admission" : "Tuyển sinh du học"}
                    </span>
                  )}
                </div>

                <h1 className={s.title}>{item.title}</h1>
                
                {item.excerpt && <p className={s.excerpt}>{item.excerpt}</p>}

                <div className={s.metaRow}>
                  <span>{lang === "en" ? "Published:" : "Ngày đăng:"} {formatDate(item.createdAt)}</span>
                  <span className={s.metaDot} />
                  <span>FLY LABOUR EDUCATION</span>
                </div>
              </div>
            </div>

            {/* Content Body Card */}
            <div className={clsx(s.card, s.bodyCard)}>
              <h2 className={s.sectionTitle}>
                <BookOpen size={18} className="text-amber-500" />
                {lang === "en" ? "Detailed Information" : "Chi tiết Chương trình"}
              </h2>
              <div
                className={s.richText}
                dangerouslySetInnerHTML={{ __html: item.content || "" }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className={s.sidebar}>
            <div className={clsx(s.card, s.stickyCard, s.widget)}>
              <h3 className={s.widgetTitle}>
                {lang === "en" ? "Program Profile" : "Thông tin tuyển sinh"}
              </h3>
              
              <div className={s.priceDisplay}>
                <p className={s.priceLabel}>{lang === "en" ? "Estimated Tuition" : "Học phí dự kiến"}</p>
                <p className={s.priceValue}>{formatPrice(item)}</p>
              </div>

              <div className={s.infoList}>
                <div className={s.infoItem}>
                  <Globe className={s.infoIcon} size={16} />
                  <div>
                    <p className={s.infoLabel}>{lang === "en" ? "Destination" : "Quốc gia du học"}</p>
                    <p className={s.infoText}>
                      {getCountryLabel(item.country) || (lang === "en" ? "Global" : "Toàn cầu")}
                    </p>
                  </div>
                </div>

                <div className={s.infoItem}>
                  <Calendar className={s.infoIcon} size={16} />
                  <div>
                    <p className={s.infoLabel}>{lang === "en" ? "Intake Term" : "Kỳ nhập học"}</p>
                    <p className={s.infoText}>
                      {item.itinerary || (lang === "en" ? "Contact adviser" : "Liên hệ tư vấn viên")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button onClick={() => setApplyModalOpen(true)} className={s.actionBtn}>
                <GraduationCap size={18} />
                {lang === "en" ? "Register Now" : "Đăng ký tư vấn ngay"}
              </button>

              {item.registerUrl && (
                <a
                  href={item.registerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={s.directLinkBtn}
                >
                  {lang === "en" ? "Apply directly" : "Nộp hồ sơ trực tiếp"}
                  <ExternalLink size={14} />
                </a>
              )}

              {/* Share Widget */}
              <div className={s.shareWidget}>
                <p className={s.shareLabel}>{lang === "en" ? "Share program" : "Chia sẻ chương trình"}</p>
                <div className={s.shareRow}>
                  <button onClick={handleShare} className={s.shareBtn} title="Copy Link">
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, "_blank")}
                    className={s.shareBtn}
                    title="Facebook"
                  >
                    <Facebook size={16} />
                  </button>
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, "_blank")}
                    className={s.shareBtn}
                    title="Twitter"
                  >
                    <Twitter size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Programs */}
        {related.length > 0 && (
          <div className={s.relatedSection}>
            <h3 className={s.relatedTitle}>
              {lang === "en" ? "Related Programs" : "Chương trình liên quan"}
            </h3>
            <div className={s.relatedGrid}>
              {related.map((x) => (
                <div key={x.id} className={s.relatedCard}>
                  <div className={s.relatedImgWrap}>
                    {x.image ? (
                      <img src={getImageUrl(x.image)} alt={x.title} className={s.relatedImg} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-amber-500">
                        <GraduationCap size={32} />
                      </div>
                    )}
                  </div>
                  <div className={s.relatedContent}>
                    <h4 className={s.relatedCardTitle}>
                      <Link to={`/study/${x.slug}`} className="hover:text-amber-600 transition">
                        {x.title}
                      </Link>
                    </h4>
                    <Link to={`/study/${x.slug}`} className={s.relatedLink}>
                      {lang === "en" ? "View details" : "Xem chi tiết"}
                      <ArrowLeft size={13} style={{ transform: "rotate(180deg)" }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <StudyApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialCountry={getCountryLabel(item.country)}
        initialUniversity={item.title}
        initialStudyType={item.studyType}
      />
    </div>
  );
}
