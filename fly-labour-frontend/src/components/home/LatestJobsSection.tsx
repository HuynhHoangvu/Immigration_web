import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import type { Job } from "@/types";

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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-gold text-sm font-semibold uppercase tracking-widest mb-2">
              {h.latestBadge}
            </p>
            <h2 className="section-title">
              <span className="gradient-text">{h.latestTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className="btn-outline text-sm px-4 py-2 flex items-center gap-1.5"
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-brand-card rounded-2xl animate-pulse border border-brand-border"
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
