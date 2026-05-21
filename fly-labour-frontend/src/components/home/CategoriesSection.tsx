import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoriesApi, getImageUrl } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import type { Category } from "@core/types";
import s from "./CategoriesSection.module.scss";

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
    <section className={s.section}>
      <div className={`fl-shell ${s.shell}`}>
        <div className={s.header}>
          <div>
            <p className={s.badge}>
              {h.catBadge}
            </p>
            <h2 className={s.title}>
              <span className="gradient-text">{h.catTitle}</span>
            </h2>
          </div>
          <Link
            to="/jobs"
            className={s.viewAll}
          >
            {h.viewAll} <ArrowRight size={14} />
          </Link>
        </div>
        <div className={s.grid}>
          {cats.map((cat) => (
            <Link
              key={cat.id}
              to={`/jobs?categoryId=${cat.id}`}
              className={s.card}
            >
              <div className={s.iconWrap}>
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
                    className={s.iconImage}
                  />
                ) : (
                  cat.icon || "🏷️"
                )}
              </div>
              <h3 className={s.name}>
                {lang === "en" ? cat.nameEn || cat.name : cat.name}
              </h3>
              {lang === "en"
                ? cat.nameEn && (
                    <p className={s.altName}>
                      {cat.name}
                    </p>
                  )
                : cat.nameEn && (
                    <p className={s.altName}>
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
