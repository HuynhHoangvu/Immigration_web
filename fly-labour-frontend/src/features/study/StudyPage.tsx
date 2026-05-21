import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown, Calendar, DollarSign, Globe, ArrowRight, BookOpen, Loader2, GraduationCap } from "lucide-react";
import { newsApi, getImageUrl } from "@core/services/api";
import type { News } from "@core/types";
import { useT } from "@core/hooks/useT";
import { formatDate } from "@core/utils/helpers";
import StudyApplyModal from "./components/StudyApplyModal";
import clsx from "clsx";
import s from "./StudyPage.module.scss";

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

export default function StudyPage() {
  const { lang } = useT();
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal Apply state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<{
    country: string;
    university: string;
    major: string;
    studyType: string;
  } | null>(null);

  const selectedCountry = params.get("country") || "";
  const selectedStudyType = params.get("studyType") || "";

  useEffect(() => {
    setLoading(true);
    const filterParams: Record<string, any> = {};
    if (selectedCountry) filterParams.country = selectedCountry;
    if (selectedStudyType) filterParams.studyType = selectedStudyType;

    newsApi
      .getAllStudy(Object.keys(filterParams).length > 0 ? filterParams : undefined)
      .then((r) => {
        setItems(r.data || []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCountry, selectedStudyType]);

  // Separate programs and news
  const { studyPrograms, studyNews } = useMemo(() => {
    // If no country is filtered, we separate them
    if (!selectedCountry) {
      const programs = items.filter((x) => x.country);
      const news = items.filter((x) => !x.country);
      return { studyPrograms: programs, studyNews: news };
    } else {
      // If a country is filtered, all retrieved items are programs for that country
      return { studyPrograms: items, studyNews: [] };
    }
  }, [items, selectedCountry]);

  // Apply search query filter on study programs
  const filteredPrograms = useMemo(() => {
    return studyPrograms.filter(
      (p) =>
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(search.toLowerCase())
    );
  }, [studyPrograms, search]);

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(params);
    if (val) p.set(key, val);
    else p.delete(key);
    setParams(p);
  };

  const clearFilters = () => {
    setSearch("");
    setParams({});
  };

  const hasFilters = !!(search || selectedCountry || selectedStudyType);

  const getCountryLabel = (countryVal?: string) => {
    if (!countryVal) return "";
    const match = COUNTRIES.find((c) => c.value === countryVal);
    return match ? match.label : countryVal;
  };

  const handleOpenApplyModal = (program: News) => {
    setSelectedProgram({
      country: getCountryLabel(program.country),
      university: program.title,
      major: "",
      studyType: program.studyType || "",
    });
    setApplyModalOpen(true);
  };

  const formatPrice = (p: News) => {
    if (!p.priceFrom && !p.priceTo) return lang === "en" ? "Contact for tuition" : "Liên hệ nhận học phí";
    if (p.priceFrom && !p.priceTo) return `${Number(p.priceFrom).toLocaleString()} ${p.priceCurrency || "VND"}`;
    return `${Number(p.priceFrom).toLocaleString()} - ${Number(p.priceTo).toLocaleString()} ${p.priceCurrency || "VND"}`;
  };

  return (
    <div className={s.page}>
      {/* Hero Section */}
      <section className={s.hero}>
        <div className={s.heroGrad} />
        <div className={s.heroBlob} style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }} />
        
        <div className={s.heroInner}>
          <p className={s.kicker}>{lang === "en" ? "International Education" : "Hành trình Tri thức"}</p>
          <h1 className={s.title}>
            <span className="gradient-text">{lang === "en" ? "Study Abroad Programs" : "Tuyển sinh & Học bổng Du học"}</span>
          </h1>
          <p className={s.subtitle}>
            {lang === "en" 
              ? "Find programs, verify requirements, and submit applications directly to universities." 
              : "Tìm kiếm các suất học bổng, chương trình học tập nước ngoài và đăng ký làm hồ sơ trực tiếp."}
          </p>

          {/* Search and Filters */}
          <div className={s.filterCard}>
            <div className={s.filterInner}>
              <div className={s.searchWrap}>
                <Search size={16} className={s.searchIcon} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === "en" ? "Search programs, countries, universities..." : "Tìm chương trình học, tên nước, trường học..."}
                  className={s.searchInput}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className={s.clearSearch}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className={s.selectWrap}>
                <select
                  value={selectedCountry}
                  onChange={(e) => setParam("country", e.target.value)}
                  className={clsx(s.select, selectedCountry ? s.selectActive : s.selectNeutral)}
                >
                  <option value="" className={s.option}>
                    {lang === "en" ? "All Countries" : "Tất cả quốc gia"}
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value} className={s.option}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className={s.selectChevron} />
              </div>

              {hasFilters && (
                <button type="button" onClick={clearFilters} className={s.clearAllBtn}>
                  <X size={13} />
                  {lang === "en" ? "Clear Filters" : "Xóa bộ lọc"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Programs List */}
      <div className={s.container}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>
            {lang === "en" ? "Study Abroad Programs" : "Chương trình Tuyển sinh"}
          </h2>
          <span className={s.sectionCount}>
            {filteredPrograms.length} {lang === "en" ? "programs" : "chương trình"}
          </span>
        </div>

        {/* Study Type Tabs */}
        <div className={s.tabsWrap}>
          {[
            { value: "", label: lang === "en" ? "All Programs" : "Tất cả" },
            { value: "university", label: lang === "en" ? "🎓 University" : "🎓 Đại học" },
            { value: "college", label: lang === "en" ? "🏫 College" : "🏫 Cao đẳng" },
            { value: "vocational", label: lang === "en" ? "💼 Vocational" : "💼 Du học nghề / Lao động" },
          ].map((t) => (
            <button
              key={t.value}
              className={clsx(s.tabBtn, selectedStudyType === t.value && s.tabBtnActive)}
              onClick={() => setParam("studyType", t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={s.loader}>
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className={s.emptyState}>
            <span className="text-4xl">🎓</span>
            <h3 className={s.emptyTitle}>{lang === "en" ? "No Programs Found" : "Không tìm thấy chương trình"}</h3>
            <p className={s.emptyDesc}>
              {lang === "en" 
                ? "Try adjusting your filters or search keywords." 
                : "Hãy thử thay đổi từ khóa hoặc bộ lọc quốc gia để tìm thêm chương trình."}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-primary">
                {lang === "en" ? "Reset Filters" : "Thiết lập lại bộ lọc"}
              </button>
            )}
          </div>
        ) : (
          <div className={s.grid}>
            {filteredPrograms.map((n) => (
              <div key={n.id} className={s.card}>
                <div className={s.imgWrap}>
                  {n.image ? (
                    <img src={getImageUrl(n.image)} alt={n.title} className={s.cardImg} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50/50 text-amber-500">
                      <GraduationCap size={48} />
                    </div>
                  )}
                  {n.priceFrom === 0 && <span className={s.hotBadge}>{lang === "en" ? "Scholarship" : "Học bổng 100%"}</span>}
                </div>
                
                <div className={s.cardContent}>
                  <div className={s.badgeRow}>
                    <span className={s.countryBadge}>
                      <Globe size={12} />
                      {getCountryLabel(n.country)}
                    </span>
                    {n.studyType && (
                      <span className={clsx(
                        s.typeBadge,
                        n.studyType === "university" && s.badgeUni,
                        n.studyType === "college" && s.badgeCol,
                        n.studyType === "vocational" && s.badgeVoc
                      )}>
                        {n.studyType === "university" && "🎓 " + (lang === "en" ? "Uni" : "Đại học")}
                        {n.studyType === "college" && "🏫 " + (lang === "en" ? "College" : "Cao đẳng")}
                        {n.studyType === "vocational" && "💼 " + (lang === "en" ? "Vocational" : "Du học nghề")}
                      </span>
                    )}
                  </div>
                  
                  <h3 className={s.cardTitle}>
                    <Link to={`/study/${n.slug}`} className="hover:text-amber-600 transition">
                      {n.title}
                    </Link>
                  </h3>
                  
                  {n.excerpt && <p className={s.cardExcerpt}>{n.excerpt}</p>}
                  
                  <div className={s.metaGrid}>
                    <div className={s.metaItem}>
                      <DollarSign size={14} className={s.metaIcon} />
                      <span>{lang === "en" ? "Tuition:" : "Học phí:"}</span>
                      <span className={s.metaValue}>{formatPrice(n)}</span>
                    </div>
                    <div className={s.metaItem}>
                      <Calendar size={14} className={s.metaIcon} />
                      <span>{lang === "en" ? "Intake:" : "Kỳ nhập học:"}</span>
                      <span className={s.metaValue}>
                        {n.itinerary || (lang === "en" ? "Contact for schedule" : "Liên hệ lịch nhập học")}
                      </span>
                    </div>
                  </div>

                  <div className={s.cardFooter}>
                    <Link to={`/study/${n.slug}`} className={s.detailBtn}>
                      {lang === "en" ? "Details" : "Xem chi tiết"}
                    </Link>
                    <button onClick={() => handleOpenApplyModal(n)} className={s.applyBtn}>
                      {lang === "en" ? "Apply" : "Đăng ký tư vấn"} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom News Section */}
      {!selectedCountry && studyNews.length > 0 && (
        <section className={s.newsSection}>
          <div className={s.container} style={{ padding: "0 1rem" }}>
            <div className={s.sectionHeader} style={{ borderBottomColor: "#cbd5e1" }}>
              <h2 className={s.sectionTitle} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BookOpen size={20} className="text-amber-600" />
                {lang === "en" ? "Study Abroad News & Guides" : "Cẩm nang & Tin tức Du học"}
              </h2>
            </div>
            
            <div className={s.grid}>
              {studyNews.slice(0, 3).map((n) => (
                <article key={n.id} className={s.newsCard}>
                  <div className={s.newsImgWrap}>
                    {n.image ? (
                      <img src={getImageUrl(n.image)} alt={n.title} className={s.newsImg} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <BookOpen size={36} />
                      </div>
                    )}
                  </div>
                  <div className={s.newsContent}>
                    <span className={s.newsDate}>{formatDate(n.createdAt)}</span>
                    <h3 className={s.newsTitle}>
                      <Link to={`/study/${n.slug}`} className="hover:text-amber-600 transition">
                        {n.title}
                      </Link>
                    </h3>
                    {n.excerpt && <p className={s.newsExcerpt}>{n.excerpt}</p>}
                    <Link to={`/study/${n.slug}`} className={s.newsLink}>
                      {lang === "en" ? "Read guide" : "Đọc bài viết"} <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Apply Modal */}
      <StudyApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialCountry={selectedProgram?.country}
        initialUniversity={selectedProgram?.university}
        initialMajor={selectedProgram?.major}
        initialStudyType={selectedProgram?.studyType}
      />
    </div>
  );
}
