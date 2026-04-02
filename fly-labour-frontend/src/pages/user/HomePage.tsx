import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroBanner from "@/components/home/HeroBanner";
import FlashSaleJobs from "@/components/home/FlashSaleJobs";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NewsSection from "@/components/home/NewsSection";
import EmployerCTASection from "@/components/home/EmployerCTASection";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import type { Job } from "@/types";

export default function HomePage() {
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
    <main>
      <HeroBanner />
      <FlashSaleJobs />
      <CategoriesSection />

      {/* Latest jobs */}
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

      <WhyChooseUs />
      <EmployerCTASection />
      <NewsSection />

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-dark p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-orange/5" />
            <div className="relative">
              <p className="text-brand-gold font-semibold text-sm uppercase tracking-widest mb-3">
                {h.ctaBadge}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-amber-600 tracking-wide mb-4">
                {h.ctaTitle}
                <br />
                <span className="gradient-text">{h.ctaTitleAccent}</span>
              </h2>
              <p className="text-slate-900 dark:text-gray-100 mb-8 max-w-lg mx-auto">
                {h.ctaDesc}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/register" className="btn-primary px-8 py-3">
                  {h.ctaRegister}
                </Link>
                <Link to="/contact" className="btn-outline px-8 py-3">
                  {h.ctaConsult}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
