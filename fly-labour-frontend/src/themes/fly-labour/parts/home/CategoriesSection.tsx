import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoriesApi, getImageUrl } from "@/core/services/api";
import { useT } from "@/core/hooks/useT";
import type { Category } from "@/core/types";

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
    <section className="py-16 transition-colors duration-300">
      <div className="w-full px-4 md:px-8 xl:px-12 overflow-hidden">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-sm font-bold uppercase tracking-widest mb-2">
              {h.catBadge}
            </p>
            <h2 className="section-title text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              <span className="gradient-text">{h.catTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-brand-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap"
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {cats.map((cat) => (
            <Link
              key={cat.id}
              to={`/jobs?categoryId=${cat.id}`}
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-3 sm:p-4 lg:p-5 text-center group hover:-translate-y-1 hover:border-amber-400 dark:hover:border-brand-gold/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 dark:hover:shadow-brand-gold/10 transition-all duration-300 min-w-0 overflow-hidden"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto mb-2 sm:mb-3 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-brand-gold/5 border border-amber-100 dark:border-brand-gold/10 group-hover:bg-amber-100 dark:group-hover:bg-brand-gold/15 group-hover:border-amber-200 dark:group-hover:border-brand-gold/30 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 shadow-sm dark:shadow-none overflow-hidden flex-shrink-0">
                {cat.icon &&
                (cat.icon.startsWith("http") ||
                  cat.icon.startsWith("/") ||
                  cat.icon.match(/^\d+$/) ||
                  cat.icon.includes(".")) ? (
                  <img
                    src={
                      cat.icon.match(/^\d+$/)
                        ? `/${cat.icon}.png`
                        : getImageUrl(cat.icon)
                    }
                    alt={cat.name}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  cat.icon || "🏷️"
                )}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-brand-gold transition-colors leading-tight">
                {lang === "en" ? cat.nameEn || cat.name : cat.name}
              </h3>
              {lang === "en"
                ? cat.nameEn && (
                    <p className="text-slate-500 dark:text-brand-muted text-xs mt-0.5 font-medium">
                      {cat.name}
                    </p>
                  )
                : cat.nameEn && (
                    <p className="text-slate-500 dark:text-brand-muted text-xs mt-0.5 font-medium">
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
