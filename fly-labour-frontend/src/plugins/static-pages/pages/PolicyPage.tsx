import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { settingsApi } from "../../../core/services/api";
import { useT } from "../../../core/hooks/useT";

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
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] pt-32 pb-20 px-6 flex justify-center">
        <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] pt-40 pb-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
          {d.title}
        </h1>
        <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <ArrowLeft size={16} /> {d.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div className="relative max-w-3xl mx-auto text-center">
          <FileText size={40} className="text-amber-500 dark:text-brand-gold mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {policy.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-brand-card shadow-sm dark:shadow-none border border-slate-200 dark:border-brand-border rounded-2xl p-6 md:p-8">
          <div 
            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: policy.content }} 
          />
        </div>
      </div>
    </div>
  );
}
