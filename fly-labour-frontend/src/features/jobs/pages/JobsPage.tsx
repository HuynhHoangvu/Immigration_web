import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X, ChevronDown } from "lucide-react";
import JobCard from "@features/jobs/components/JobCard";
import { jobsApi, categoriesApi } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import { getCountriesList } from "@core/utils/helpers";
import type { Job, Category, Country, JobType } from "@core/types";
import clsx from "clsx";
import s from "./JobsPage.module.scss";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useT();
  const j = t("jobs");

  const search = searchParams.get("search") || "";
  const country = searchParams.get("country") || "";
  const jobType = searchParams.get("jobType") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sort = searchParams.get("sort") || "newest";

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const jobsQuery = useQuery<{ data: Job[]; meta: { total: number } }, Error>({
    queryKey: ["jobs", search, country, jobType, categoryId, sort],
    queryFn: async () => {
      const response = await jobsApi.getAll({
        search,
        country,
        jobType,
        categoryId,
        sort,
        limit: 20,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const jobs = jobsQuery.data?.data ?? [];
  const total = jobsQuery.data?.meta?.total ?? 0;
  const cats = categoriesQuery.data ?? [];
  const isLoading = jobsQuery.isLoading || categoriesQuery.isLoading;

  const COUNTRIES: { value: Country | ""; label: string }[] = [
    { value: "", label: j.allCountries },
    ...(getCountriesList() as { value: Country; label: string }[]),
  ];

  const jt = t("jobType");
  const JOB_TYPES: { value: JobType | ""; label: string }[] = [
    { value: "", label: j.allTypes },
    { value: "full_time", label: jt.full_time },
    { value: "part_time", label: jt.part_time },
    { value: "contract", label: jt.contract },
    { value: "seasonal", label: jt.seasonal },
  ];

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };
  const clearAll = () => setSearchParams({});
  const hasFilters = !!(search || country || jobType || categoryId);

  const activeCount = [search, country, jobType, categoryId].filter(
    Boolean,
  ).length;

  const SORT_OPTIONS = useMemo(
    () => [
      { value: "newest", label: j.newest },
      { value: "hot", label: j.sortHot ?? "Hot nhất" },
      { value: "salary_desc", label: j.sortSalary ?? "Lương cao nhất" },
    ],
    [j],
  );

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <div className={s.heroGrad} />
        <div
          className={s.heroBlob}
          style={{
            background: "linear-gradient(135deg,#e4a808,#fdd52f)",
          }}
        />

        <div className={s.heroInner}>
          <p className={s.kicker}>Việc làm quốc tế</p>
          <h1 className={s.title}>
            <span className="gradient-text">{j.title}</span>
          </h1>
          <p className={s.subtitle}>{j.subtitle}</p>

          <div className={s.filterCard}>
            <div className={s.filterInner}>
              <div className={s.searchWrap}>
                <Search size={16} className={s.searchIcon} />
                <input
                  value={search}
                  onChange={(e) => setParam("search", e.target.value)}
                  placeholder={j.search}
                  className={s.searchInput}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setParam("search", "")}
                    className={s.clearSearch}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className={s.filtersRow}>
                <div className={s.selectWrap}>
                  <select
                    value={country}
                    onChange={(e) => setParam("country", e.target.value)}
                    className={clsx(
                      s.select,
                      country ? s.selectActive : s.selectNeutral,
                    )}
                  >
                    <option value="" className={s.option}>
                      Tất cả quốc gia
                    </option>
                    {COUNTRIES.map((c) => (
                      <option
                        key={c.value || "all-c"}
                        value={c.value}
                        className={s.option}
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className={s.selectChevron} />
                </div>

                <div className={s.selectWrap}>
                  <select
                    value={jobType}
                    onChange={(e) => setParam("jobType", e.target.value)}
                    className={clsx(
                      s.select,
                      jobType ? s.selectActive : s.selectNeutral,
                    )}
                  >
                    <option value="" className={s.option}>
                      Tất cả loại hình
                    </option>
                    {JOB_TYPES.map((tp) => (
                      <option
                        key={tp.value || "all-t"}
                        value={tp.value}
                        className={s.option}
                      >
                        {tp.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className={s.selectChevron} />
                </div>

                <div className={s.selectWrap}>
                  <select
                    value={categoryId}
                    onChange={(e) => setParam("categoryId", e.target.value)}
                    className={clsx(
                      s.select,
                      categoryId ? s.selectActive : s.selectNeutral,
                    )}
                  >
                    <option value="" className={s.option}>
                      {j.allCategories}
                    </option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id} className={s.option}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className={s.selectChevron} />
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className={s.clearAllBtn}
                  >
                    <X size={13} />
                    {j.clearAll}
                    {activeCount > 1 && (
                      <span className={s.badgeCount}>{activeCount}</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={s.results}>
        <div className={s.resultsHeader}>
          <span className={s.foundText}>
            {j.found}{" "}
            <span className={s.foundStrong}>{total}</span> {j.positions}
          </span>
          <div className={s.sortRow}>
            <span>{j.sort}</span>
            <div className={s.sortWrap}>
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className={s.sortSelect}
              >
                {SORT_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className={s.option}
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className={s.sortChevron} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={s.grid}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className={s.skeleton} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className={s.empty}>
            <p className={s.emptyEmoji}>🔍</p>
            <p className={s.emptyTitle}>{j.noResults}</p>
            <p className={s.emptySub}>{j.noResultsSub}</p>
            <button
              type="button"
              onClick={clearAll}
              className={s.emptyBtn}
            >
              {j.clearFilters}
            </button>
          </div>
        ) : (
          <div className={s.grid}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
