import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobCard from "@/plugins/jobs/components/JobCard";
import { jobsApi } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import type { Job } from "@/core/types";

export default function LatestJobsSection() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useT();
  const h = t("home");

  useEffect(() => {
    jobsApi
      .getAll({ limit: 6 })
      .then((r) => setLatestJobs(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-sm font-bold uppercase tracking-widest mb-2 transition-colors">
              {h.latestBadge}
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 dark:text-white transition-colors">
              <span className="gradient-text">{h.latestTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-slate-100 dark:bg-[#1e1e1e] rounded-2xl animate-pulse border border-slate-200 dark:border-brand-border transition-colors"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
