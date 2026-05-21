import { useT } from "@core/hooks/useT";
import s from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  const { t } = useT();
  const nf = t("notFound");
  return (
    <div className={`${s.root} fl-surface-page`}>
      <div className={s.inner}>
        <p className={`font-display gradient-text ${s.code}`}>404</p>
        <p className={s.title}>{nf.title}</p>
        <a href="/" className={`btn-primary ${s.back}`}>
          {nf.back}
        </a>
      </div>
    </div>
  );
}
