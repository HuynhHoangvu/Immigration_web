import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, ChevronDown } from "lucide-react";
import JobCard from "@/plugins/jobs/components/JobCard";
import { jobsApi, categoriesApi } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import { getCountriesList } from "@/core/utils/helpers";
import type { Job, Category, Country, JobType } from "@/core/types";

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
    <div className="min-h-screen pt-20 bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Header + Search + Filters */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-brand-border py-14 px-6">
        {/* Gradient nền linh hoạt Light/Dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/50 dark:from-[#1a0f00] dark:via-brand-dark dark:to-[#0d1117] transition-colors duration-500" />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{
            background: "linear-gradient(135deg,#e4a808,#fdd52f)",
            transform: "translate(30%,-40%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
            Việc làm quốc tế
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
            <span className="gradient-text">{j.title}</span>
          </h1>
          <p className="text-slate-600 dark:text-brand-muted mb-8 max-w-xl text-justify">
            {j.subtitle}
          </p>

          {/* Search + Filter bar */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-md p-5 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all">
            <div className="flex flex-col gap-4 md:gap-5">
              {/* Row 1: Search input */}
              <div className="relative max-w-2xl">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-brand-muted"
                />
                <input
                  value={search}
                  onChange={(e) => setParam("search", e.target.value)}
                  placeholder={j.search}
                  className="w-full h-12 pl-11 pr-10 text-sm rounded-xl bg-slate-100 dark:bg-[#1e1e1e] border-transparent dark:border-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:bg-white dark:focus:bg-black focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all"
                />
                {search && (
                  <button
                    onClick={() => setParam("search", "")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:text-brand-muted dark:hover:text-white transition-colors"
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
              ? "bg-amber-100 text-amber-900 border-amber-300 font-medium dark:bg-brand-gold dark:text-brand-dark dark:border-brand-gold"
              : "bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          }`}
                  >
                    <option
                      value=""
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
                    >
                      Tất cả quốc gia
                    </option>
                    {COUNTRIES.map((c) => (
                      <option
                        key={c.value}
                        value={c.value}
                        className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
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
              ? "bg-amber-100 text-amber-900 border-amber-300 font-medium dark:bg-brand-gold dark:text-brand-dark dark:border-brand-gold"
              : "bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          }`}
                  >
                    <option
                      value=""
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
                    >
                      Tất cả loại hình
                    </option>
                    {JOB_TYPES.map((tp) => (
                      <option
                        key={tp.value}
                        value={tp.value}
                        className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
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
              ? "bg-amber-100 text-amber-900 border-amber-300 font-medium dark:bg-brand-gold dark:text-brand-dark dark:border-brand-gold"
              : "bg-slate-100 border-transparent text-slate-700 hover:bg-slate-200 dark:bg-[#1e1e1e] dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          }`}
                  >
                    <option
                      value=""
                      className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
                    >
                      {j.allCategories}
                    </option>
                    {cats.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        className="bg-white text-slate-900 dark:bg-[#1e1e1e] dark:text-white"
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
                    className="h-10 px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-sm transition-colors flex items-center gap-1.5"
                  >
                    <X size={13} />
                    {j.clearAll}
                    {activeCount > 1 && (
                      <span className="w-4 h-4 rounded-full bg-red-200 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs flex items-center justify-center font-semibold">
                        {activeCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-slate-600 dark:text-brand-muted">
            {j.found}{" "}
            <span className="text-slate-900 dark:text-white font-semibold">
              {total}
            </span>{" "}
            {j.positions}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-brand-muted">
            <span>{j.sort}</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="appearance-none bg-transparent text-slate-900 font-medium dark:text-white hover:text-amber-600 dark:hover:text-brand-gold transition-colors cursor-pointer outline-none pr-4"
              >
                {SORT_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    className="bg-white text-slate-900 dark:bg-brand-dark dark:text-white"
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
                className="h-72 bg-white dark:bg-brand-card rounded-2xl animate-pulse border border-slate-200 dark:border-brand-border"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-16 text-center max-w-md mx-auto shadow-sm">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-900 dark:text-white font-semibold mb-1">
              {j.noResults}
            </p>
            <p className="text-slate-500 dark:text-brand-muted text-sm">
              {j.noResultsSub}
            </p>
            <button
              onClick={clearAll}
              className="mt-4 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-sm px-5 py-2 transition-colors"
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
