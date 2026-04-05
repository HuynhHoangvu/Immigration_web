import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi, categoriesApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import { getCountriesList } from "@/utils/helpers";
import type { Job, Category, Country, JobType } from "@/types";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { t } = useT();
  const j = t("jobs");

  const search = searchParams.get("search") || "";
  const country = searchParams.get("country") || "";
  const jobType = searchParams.get("jobType") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((r) => setCats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    jobsApi
      .getAll({ search, country, jobType, categoryId, sort, limit: 20 })
      .then((r) => {
        setJobs(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, country, jobType, categoryId, sort]);

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

  const SORT_OPTIONS = [
    { value: "newest", label: j.newest },
    { value: "hot", label: j.sortHot ?? "Hot nhất" },
    { value: "salary_desc", label: j.sortSalary ?? "Lương cao nhất" },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header + Search + Filters */}
      <div className="bg-brand-card border-b border-brand-border py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-1">
            <span className="gradient-text">{j.title}</span>
          </h1>
          <p className="text-brand-muted text-sm mb-6">{j.subtitle}</p>

          {/* Search + Filter bar */}
          <div className="flex flex-col gap-3">
            {/* Row 1: Search input */}
            <div className="relative max-w-2xl">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
              />
              <input
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
                placeholder={j.search}
                className="input-dark pl-11 h-12 text-sm w-full"
              />
              {search && (
                <button
                  onClick={() => setParam("search", "")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Row 2: Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Country */}
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setParam("country", e.target.value)}
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-brand-gold/50
        ${
          country
            ? "bg-brand-gold text-brand-dark border-brand-gold font-medium"
            : "bg-white border-gray-200 text-slate-900 hover:bg-gray-50 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-slate-900 dark:hover:bg-white/10"
        }`}
                >
                  <option
                    value=""
                    className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                  >
                    Tất cả quốc gia
                  </option>
                  {COUNTRIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60"
                />
              </div>

              {/* Job Type */}
              <div className="relative">
                <select
                  value={jobType}
                  onChange={(e) => setParam("jobType", e.target.value)}
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-brand-gold/50
        ${
          jobType
            ? "bg-brand-gold text-brand-dark border-brand-gold font-medium"
            : "bg-white border-gray-200 text-slate-900 hover:bg-gray-50 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-slate-900 dark:hover:bg-white/10"
        }`}
                >
                  <option
                    value=""
                    className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                  >
                    Tất cả loại hình
                  </option>
                  {JOB_TYPES.map((tp) => (
                    <option
                      key={tp.value}
                      value={tp.value}
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                    >
                      {tp.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60"
                />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setParam("categoryId", e.target.value)}
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-brand-gold/50
        ${
          categoryId
            ? "bg-brand-gold text-brand-dark border-brand-gold font-medium"
            : "bg-white border-gray-200 text-slate-900 hover:bg-gray-50 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-slate-900 dark:hover:bg-white/10"
        }`}
                >
                  <option
                    value=""
                    className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                  >
                    {j.allCategories}
                  </option>
                  {cats.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-slate-900"
                    >
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60"
                />
              </div>

              {/* Clear all */}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="h-10 px-3 rounded-xl border border-red-500/30 text-red-500 bg-red-50/50 hover:bg-red-50 dark:text-red-400 dark:bg-transparent dark:hover:bg-red-500/10 text-sm transition-colors flex items-center gap-1.5"
                >
                  <X size={13} />
                  {j.clearAll}
                  {activeCount > 1 && (
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs flex items-center justify-center font-semibold">
                      {activeCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-brand-muted">
            {j.found} <span className="text-white font-semibold">{total}</span>{" "}
            {j.positions}
          </span>
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span>{j.sort}</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="appearance-none bg-transparent text-white hover:text-brand-gold transition-colors cursor-pointer outline-none pr-4"
              >
                {SORT_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-brand-dark text-white"
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-60"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-brand-card rounded-2xl animate-pulse border border-brand-border"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-dark p-16 text-center max-w-md mx-auto">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white font-semibold mb-1">{j.noResults}</p>
            <p className="text-brand-muted text-sm">{j.noResultsSub}</p>
            <button
              onClick={clearAll}
              className="mt-4 btn-outline text-sm px-5 py-2"
            >
              {j.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
