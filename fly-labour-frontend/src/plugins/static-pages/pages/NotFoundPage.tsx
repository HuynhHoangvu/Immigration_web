import { useT } from "@/core/hooks/useT";

export default function NotFoundPage() {
  const { t } = useT();
  const nf = t("notFound");
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-9xl gradient-text drop-shadow-md">404</p>
        <p className="text-slate-900 dark:text-white font-semibold text-xl mt-2 transition-colors">
          {nf.title}
        </p>
        <a href="/" className="btn-primary inline-block mt-6 px-6 py-3 font-medium">
          {nf.back}
        </a>
      </div>
    </div>
  );
}
