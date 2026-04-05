import { Link } from "react-router-dom";
import { MapPin, Clock, Users, TrendingUp, Eye } from "lucide-react";
import type { Job } from "@/types";
import {
  getCountryLabels,
  getJobTypeLabel,
  formatSalary,
  timeAgo,
} from "@/utils/helpers";
import { useT } from "@/hooks/useT";

// Default images per country if no custom image
const COUNTRY_IMAGES: Record<string, string> = {
  australia:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=70&fit=crop",
  canada:
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=70&fit=crop",
  new_zealand:
    "https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&q=70&fit=crop",
};

// Category placeholder images
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
  // Strip flag emoji for display next to flag
  const countryName = countryLabel
    .replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "")
    .trim();

  const countryFlagMap: Record<string, string> = {
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
  const flag = countryFlagMap[job.country] ?? "";

  const expired = isExpired(job.deadline);

  const thumbUrl =
    job.image ||
    CATEGORY_IMAGES[job.categoryId || ""] ||
    COUNTRY_IMAGES[job.country];

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card-dark flex flex-col h-full group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/10"
    >
      {/* Thumbnail image */}
      {!compact && (
        <div className="relative h-40 overflow-hidden bg-brand-dark">
          <img
            src={thumbUrl}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              const fallback = COUNTRY_IMAGES[job.country];
              if (img.src !== fallback) img.src = fallback;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card/90 via-brand-card/20 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {expired && (
              <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Hết hạn
              </span>
            )}
            {!expired && job.isHot && (
              <span className="badge-hot text-[10px]">🔥 Hot</span>
            )}
            {!expired && job.isFeatured && (
              <span className="bg-brand-gold/90 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {jc.featured}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span className="badge-country text-[10px]">
              {flag} {countryName}
            </span>
          </div>

          {job.deadline && (
            <div className="absolute bottom-2 right-3 text-[10px] text-white/70">
              {jc.deadline}{" "}
              {new Date(job.deadline).toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {compact && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {expired && (
              <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Hết hạn
              </span>
            )}
            {!expired && job.isHot && (
              <span className="badge-hot text-[10px]">🔥 Hot</span>
            )}
            <span className="badge-country text-[10px]">
              {flag} {countryName}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-brand-yellow group-hover:text-brand-gold transition-colors leading-snug mb-1 line-clamp-2 text-sm">
          {job.title}
        </h3>
        {job.company && (
          <p className="text-brand-muted text-xs mb-3">{job.company}</p>
        )}

        <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-xl px-3 py-2 mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-brand-gold" />
            <span className="text-brand-gold font-semibold text-xs">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-brand-muted flex-1">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={10} /> {getJobTypeLabel(job.jobType)}
          </span>
          {job.slots && (
            <span className="flex items-center gap-1">
              <Users size={10} /> {job.slots} {jc.slots}
            </span>
          )}
          {job.viewCount > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <Eye size={10} /> {job.viewCount}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-gray-200 dark:border-brand-gray-700">
          {job.category ? (
            <span className="text-[11px] px-2 py-0.5 bg-brand-gray-100 dark:bg-brand-gray-800 rounded-lg text-brand-gray-700 dark:text-brand-gray-300">
              {job.category.icon}{" "}
              {lang === "en"
                ? job.category.nameEn || job.category.name
                : job.category.name}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[11px] text-brand-muted">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
