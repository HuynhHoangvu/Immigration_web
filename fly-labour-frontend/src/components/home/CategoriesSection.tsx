import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoriesApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import type { Category } from "@/types";

export default function CategoriesSection() {
  const [cats, setCats] = useState<Category[]>([]);
  const { t, lang } = useT();
  const h = t("home");

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => setCats(res.data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-2">
              {h.catBadge}
            </p>
            <h2 className="section-title">
              <span className="gradient-text">{h.catTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className="btn-outline text-sm px-4 py-2 flex items-center gap-1.5 whitespace-nowrap"
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              to={`/jobs?categoryId=${cat.id}`}
              className="card-dark p-5 text-center group hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-yellow/10 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/10 group-hover:bg-brand-yellow/15 group-hover:border-brand-yellow/30 flex items-center justify-center text-3xl transition-all duration-300">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-brand-yellow transition-colors">
                {lang === "en" ? cat.nameEn || cat.name : cat.name}
              </h3>
              {lang === "en"
                ? cat.nameEn && (
                    <p className="text-brand-muted text-xs mt-0.5">
                      {cat.name}
                    </p>
                  )
                : cat.nameEn && (
                    <p className="text-brand-muted text-xs mt-0.5">
                      {cat.nameEn}
                    </p>
                  )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
