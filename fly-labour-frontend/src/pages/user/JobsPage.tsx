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
  const j = t('jobs');

  const search = searchParams.get("search") || "";
  const country = searchParams.get("country") || "";
  const jobType = searchParams.get("jobType") || "";
  const categoryId = searchParams.get("categoryId") || "";

  useEffect(() => {
    categoriesApi.getAll().then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    jobsApi
      .getAll({ search, country, jobType, categoryId, limit: 20 })
      .then((r) => {
        setJobs(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, country, jobType, categoryId]);

  const COUNTRIES: { value: Country | ""; label: string }[] = [
    { value: "", label: j.allCountries },
    ...getCountriesList() as { value: Country; label: string }[],
  ];

  const jt = t('jobType');
  const JOB_TYPES: { value: JobType | ""; label: string }[] = [
    { value: "", label: j.allTypes },
    { value: "full_time", label: jt.full_time },
    { value: "part_time", label: jt.part_time },
    { value: "contract",  label: jt.contract },
    { value: "seasonal",  label: jt.seasonal },
  ];

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };
  const clearAll = () => setSearchParams({});
  const hasFilters = !!(search || country || jobType || categoryId);

  const activeCount = [search, country, jobType, categoryId].filter(Boolean).length;

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
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
                placeholder={j.search}
                className="input-dark pl-11 h-12 text-sm w-full"
              />
              {search && (
                <button
                  onClick={() => setParam("search", "")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
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
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none
                    ${country
                      ? "bg-brand-yellow/10 border-brand-yellow/40 text-brand-yellow"
                      : "bg-white/5 border-brand-border text-gray-300 hover:border-brand-yellow/30 hover:text-white"
                    }`}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-brand-dark text-white">
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60" />
              </div>

              {/* Job Type */}
              <div className="relative">
                <select
                  value={jobType}
                  onChange={(e) => setParam("jobType", e.target.value)}
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none
                    ${jobType
                      ? "bg-brand-yellow/10 border-brand-yellow/40 text-brand-yellow"
                      : "bg-white/5 border-brand-border text-gray-300 hover:border-brand-yellow/30 hover:text-white"
                    }`}
                >
                  {JOB_TYPES.map((tp) => (
                    <option key={tp.value} value={tp.value} className="bg-brand-dark text-white">
                      {tp.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60" />
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setParam("categoryId", e.target.value)}
                  className={`appearance-none h-10 pl-3 pr-8 rounded-xl text-sm border transition-colors cursor-pointer outline-none
                    ${categoryId
                      ? "bg-brand-yellow/10 border-brand-yellow/40 text-brand-yellow"
                      : "bg-white/5 border-brand-border text-gray-300 hover:border-brand-yellow/30 hover:text-white"
                    }`}
                >
                  <option value="" className="bg-brand-dark text-white">{j.allCategories}</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id} className="bg-brand-dark text-white">
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current opacity-60" />
              </div>

              {/* Clear all */}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="h-10 px-3 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                >
                  <X size={13} />
                  {j.clearAll}
                  {activeCount > 1 && (
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-semibold">
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
            {j.found} <span className="text-white font-semibold">{total}</span> {j.positions}
          </span>
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span>{j.sort}</span>
            <button className="flex items-center gap-1 text-white hover:text-brand-yellow transition-colors">
              {j.newest} <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-brand-card rounded-2xl animate-pulse border border-brand-border" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-dark p-16 text-center max-w-md mx-auto">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white font-semibold mb-1">{j.noResults}</p>
            <p className="text-brand-muted text-sm">{j.noResultsSub}</p>
            <button onClick={clearAll} className="mt-4 btn-outline text-sm px-5 py-2">
              {j.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
