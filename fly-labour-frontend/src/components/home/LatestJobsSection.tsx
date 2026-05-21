import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobCard from "@features/jobs/components/JobCard";
import { jobsApi } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import type { Job } from "@core/types";
import s from "./LatestJobsSection.module.scss";

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
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className={s.header}>
          <div>
            <p className={s.badge}>
              {h.latestBadge}
            </p>
            <h2 className={s.title}>
              <span className="gradient-text">{h.latestTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className={s.viewAll}
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className={s.grid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={s.skeleton} />
            ))}
          </div>
        ) : (
          <div className={s.grid}>
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
