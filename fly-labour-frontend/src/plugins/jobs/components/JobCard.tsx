import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Flame,
  TimerOff,
} from "lucide-react";
import type { Job } from "@/core/types";
import {
  getCountryLabels,
  getJobTypeLabel,
  formatSalary,
  timeAgo,
} from "@/core/utils/helpers";
import { useT } from "@/core/hooks/useT";
import { getImageUrl } from "@/core/services/api";

const COUNTRY_IMAGES: Record<string, string> = {
  australia:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=70&fit=crop",
  canada:
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=70&fit=crop",
  new_zealand:
    "https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&q=70&fit=crop",
};

const CATEGORY_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70&fit=crop",
  "2": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=70&fit=crop",
  "3": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70&fit=crop",
  "4": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70&fit=crop",
  "5": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&fit=crop",
  "6": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=70&fit=crop",
  "7": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=70&fit=crop",
  "8": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=70&fit=crop",
};

const FLAG_MAP: Record<string, string> = {
  australia: "🇦🇺",
  canada: "🇨🇦",
  new_zealand: "🇳🇿",
  norway: "🇳🇴",
  germany: "🇩🇪",
  portugal: "🇵🇹",
  czech: "🇨🇿",
  us: "🇺🇸",
  uk: "🇬🇧",
  japan: "🇯🇵",
  singapore: "🇸🇬",
  south_korea: "🇰🇷",
  taiwan: "🇹🇼",
  uae: "🇦🇪",
};

interface Props {
  job: Job;
  compact?: boolean;
}

function isExpired(deadline?: string) {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toDateString());
}

export default function JobCard({ job, compact }: Props) {
  const { t, lang } = useT();
  const jc = t("jobCard");
  const countryLabels = getCountryLabels();
  const countryLabel = countryLabels[job.country] ?? job.country;
  const countryName = countryLabel
    .replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "")
    .trim();
  const flag = FLAG_MAP[job.country] ?? "";
  const expired = isExpired(job.deadline);
  const thumbUrl =
    job.image ||
    CATEGORY_IMAGES[job.categoryId || ""] ||
    COUNTRY_IMAGES[job.country];

  return (
    <Link
      to={`/jobs/${job.id}`}
      className={`group flex flex-col h-full min-h-[20rem] sm:min-h-[24rem] lg:min-h-[28rem] bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-3xl overflow-hidden transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/8 hover:border-amber-300 dark:hover:border-brand-gold/40
        ${expired ? "opacity-70" : ""}`}
    >
      {/* ── Thumbnail ── */}
      {!compact && (
        <div className="relative h-36 sm:h-40 lg:h-44 overflow-hidden bg-slate-100 dark:bg-brand-dark flex-shrink-0">
          <img
            src={thumbUrl}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              const fb = COUNTRY_IMAGES[job.country];
              if (img.src !== fb && fb) img.src = fb;
            }}
          />
          {/* overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badge top-left */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {expired && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-200 backdrop-blur-sm">
                <TimerOff size={9} /> {jc.expired}
              </span>
            )}
            {!expired && job.isHot && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                <Flame size={9} className="fill-yellow-300 text-yellow-300" />{" "}
                HOT
              </span>
            )}
            {!expired && job.isFeatured && (
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 shadow-sm">
                {jc.featured}
              </span>
            )}
          </div>

          {/* Country badge bottom-right */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20">
              {flag} {countryName}
            </span>
          </div>

          {/* Deadline bottom-left */}
          {job.deadline && !expired && (
            <div className="absolute bottom-3 left-3 text-[10px] font-medium text-white/80">
              {jc.deadline}{" "}
              {new Date(job.deadline).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Card Body ── */}
      <div className="flex flex-col flex-1 min-h-0 p-3 sm:p-4 lg:p-5 gap-2 sm:gap-3">
        {/* Compact mode: badges on top */}
        {compact && (
          <div className="flex gap-1.5 flex-wrap">
            {expired && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-500/40">
                <TimerOff size={9} /> {jc.expired}
              </span>
            )}
            {!expired && job.isHot && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Flame size={9} className="fill-yellow-300 text-yellow-300" />{" "}
                HOT
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              {flag} {countryName}
            </span>
          </div>
        )}

        {/* Job title — Level 1: to, đậm, tối */}
        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors">
          {job.title}
        </h3>

        {/* Company — Level 2: vừa, nhạt hơn */}
        {job.company && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 -mt-1">
            {job.company}
          </p>
        )}

        {/* Salary highlight — nổi bật bằng màu, không cần to */}
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-brand-gold/5 border border-amber-200 dark:border-brand-gold/20 rounded-xl px-2 py-1.5 sm:px-3 sm:py-2">
          <TrendingUp
            size={13}
            className="text-amber-600 dark:text-brand-gold flex-shrink-0"
          />
          <span className="text-amber-700 dark:text-brand-gold font-bold text-sm">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        </div>

        {/* Meta row: location / type / slots — Level 3: nhỏ, nhạt, đồng đều */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {job.location && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <MapPin size={11} className="flex-shrink-0" /> {job.location}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock size={11} className="flex-shrink-0" />{" "}
            {getJobTypeLabel(job.jobType)}
          </span>
          {job.slots && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Users size={11} className="flex-shrink-0" /> {job.slots}{" "}
              {jc.slots}
            </span>
          )}
        </div>

        {/* Footer: category + time — nhỏ nhất, vai trò phụ */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-auto">
          {job.category ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
              {job.category.icon?.startsWith("http") ||
              job.category.icon?.startsWith("/") ||
              job.category.icon?.match(/^\d+$/) ? (
                <img
                  src={
                    job.category.icon?.match(/^\d+$/)
                      ? `/${job.category.icon}.png`
                      : getImageUrl(job.category.icon)
                  }
                  alt=""
                  className="w-3 h-3 object-contain"
                />
              ) : (
                job.category.icon
              )}
              {lang === "en"
                ? job.category.nameEn || job.category.name
                : job.category.name}
            </span>
          ) : (
            <span />
          )}
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
