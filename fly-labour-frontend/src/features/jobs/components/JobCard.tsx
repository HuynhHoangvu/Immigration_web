import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Flame,
  TimerOff,
} from "lucide-react";
import type { Job } from "@core/types";
import {
  getCountryLabels,
  getJobTypeLabel,
  formatSalary,
  timeAgo,
} from "@core/utils/helpers";
import { useT } from "@core/hooks/useT";
import { getImageUrl } from "@core/services/api";
import CountryFlag from "@components/widgets/CountryFlag";
import clsx from "clsx";
import s from "./JobCard.module.scss";

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
  "6": "https://images.unsplash.com/photo-1559839734-2b65d9df7ec2?w=600&q=70&fit=crop",
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
  const countryName = countryLabel
    .replace(/[\u{1F1E0}-\u{1F1FF}]{2}/gu, "")
    .trim();
  const expired = isExpired(job.deadline);
  const thumbUrl =
    job.image ||
    CATEGORY_IMAGES[job.categoryId || ""] ||
    COUNTRY_IMAGES[job.country];

  return (
    <Link
      to={`/jobs/${job.id}`}
      className={clsx(s.link, expired && s.linkExpired)}
    >
      {!compact && (
        <div className={s.thumbWrap}>
          <img
            src={thumbUrl}
            alt={job.title}
            className={s.thumbImg}
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              const fb = COUNTRY_IMAGES[job.country];
              if (img.src !== fb && fb) img.src = fb;
            }}
          />
          <div className={s.thumbGradient} />

          <div className={s.badgesTop}>
            {expired && (
              <span className={s.badgeExpired}>
                <TimerOff size={9} /> {jc.expired}
              </span>
            )}
            {!expired && job.isHot && (
              <span className={s.badgeHot}>
                <Flame size={9} className={s.badgeHotIcon} /> HOT
              </span>
            )}
            {!expired && job.isFeatured && (
              <span className={s.badgeFeatured}>{jc.featured}</span>
            )}
          </div>

          <div className={s.countryBadgeWrap}>
            <span className={s.countryBadge}>
              <CountryFlag country={job.country} /> {countryName}
            </span>
          </div>

          {job.deadline && !expired && (
            <div className={s.deadline}>
              {jc.deadline}{" "}
              {new Date(job.deadline).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })}
            </div>
          )}
        </div>
      )}

      <div className={s.body}>
        {compact && (
          <div className={s.badgesCompact}>
            {expired && (
              <span className={s.badgeExpiredLight}>
                <TimerOff size={9} /> {jc.expired}
              </span>
            )}
            {!expired && job.isHot && (
              <span className={s.badgeHot}>
                <Flame size={9} className={s.badgeHotIcon} /> HOT
              </span>
            )}
            <span className={s.badgeCountryCompact}>
              <CountryFlag country={job.country} /> {countryName}
            </span>
          </div>
        )}

        <h3 className={s.title}>{job.title}</h3>

        {job.company && <p className={s.company}>{job.company}</p>}

        <div className={s.salaryRow}>
          <TrendingUp size={13} className={s.salaryIcon} />
          <span className={s.salaryText}>
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        </div>

        <div className={s.metaRow}>
          {job.location && (
            <span className={s.metaItem}>
              <MapPin size={11} className={s.metaIcon} /> {job.location}
            </span>
          )}
          <span className={s.metaItem}>
            <Clock size={11} className={s.metaIcon} />{" "}
            {getJobTypeLabel(job.jobType)}
          </span>
          {job.slots && (
            <span className={s.metaItem}>
              <Users size={11} className={s.metaIcon} /> {job.slots} {jc.slots}
            </span>
          )}
        </div>

        <div className={s.footer}>
          {job.category ? (
            <span className={s.categoryTag}>
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
                  className={s.categoryIcon}
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
          <span className={s.timeAgo}>{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
