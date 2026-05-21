import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clsx from "clsx";
import { FileText, ArrowLeft } from "lucide-react";
import { settingsApi } from "@core/services/api";
import { useT } from "@core/hooks/useT";
import s from "./PolicyPage.module.scss";

export default function PolicyPage() {
  const { slug } = useParams();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useT();
  const d = t("notFound");

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      try {
        const res = await settingsApi.getAll();
        if (res?.data?.policies) {
          const policies = JSON.parse(res.data.policies);
          const found = policies.find((p: any) => p.slug === slug);
          setPolicy(found);
        }
      } catch (err) {
        console.error("Failed to load policy:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchPolicy();
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className={clsx(s.loadingWrap, "fl-surface-page")}>
        <span className={s.spinner} />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className={clsx(s.emptyWrap, "fl-surface-page")}>
        <h1 className={clsx(s.emptyTitle, "animate-fade-in-up")}>{d.title}</h1>
        <Link
          to="/"
          className={clsx("btn-primary", s.emptyBack, "animate-fade-in-up")}
          style={{ animationDelay: "100ms" }}
        >
          <ArrowLeft size={16} /> {d.back}
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx(s.page, "fl-surface-page")}>
      <div className={s.hero}>
        <div className={s.heroBg} />
        <div className={clsx(s.heroInner, "fl-max-3xl")}>
          <FileText size={40} className={s.heroIcon} />
          <h1 className={s.heroTitle}>{policy.title}</h1>
        </div>
      </div>

      <div className={s.content}>
        <div className={clsx("fl-max-3xl", s.paper)}>
          <div
            className={clsx("prose", s.proseBody)}
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </div>
      </div>
    </div>
  );
}
