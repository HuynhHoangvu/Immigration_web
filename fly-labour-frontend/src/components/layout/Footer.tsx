import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useT } from "@core/hooks/useT";
import { usePageContent } from "@core/hooks/usePageContent";
import { useState, useEffect } from "react";
import { settingsApi } from "@core/services/api";
import s from "./Footer.module.scss";

interface Policy {
  slug: string;
  title: string;
  displayInFooter: boolean;
  content: string;
  order: number;
}

export default function Footer() {
  const { t } = useT();
  const f = t("footer");

  const address = usePageContent(
    "footer.address",
    "219A Nơ Trang Long, Phường 12, Quận Bình Thạnh, TP. Hồ Chí Minh",
  );
  const phone = usePageContent(
    "footer.phone",
    "Hotline: 0866-879-755\nTư vấn: 028 3899 4679\nHồ sơ: 028 3899 4879",
  );
  const email = usePageContent(
    "footer.email",
    "visa.service@flyimmigration.vn",
  );
  const officeHours = usePageContent("footer.officeHours", f.officeHours);
  const hoursText = usePageContent("footer.hoursText", f.hoursText);
  const copyright = usePageContent("footer.copyright", f.copyright);

  const bct = usePageContent(
    "footer.bct",
    "Đã đăng ký với Bộ Công Thương — ĐKKD số 0316444315",
  );

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const result = await settingsApi.getAll();
      if (result?.data?.policies) {
        const parsed = JSON.parse(result.data.policies);
        const visible = parsed
          .filter((p: Policy) => p.displayInFooter)
          .sort((a: Policy, b: Policy) => a.order - b.order);
        setPolicies(visible);
      }
    } catch {
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  };

  return (
    <footer className={s.footer}>
      <div className={`${s.footer__inner} fl-max-7xl`}>
        <div>
          <div className={s.footer__brandBlock}>
            <img
              src="/logo.png"
              alt="Fly Immigration"
              className={s.footer__logo}
            />
          </div>
          <p className={s.footer__tagline}>{f.tagline}</p>
          <div className={s.footer__socialRow}>
            <a
              href="https://www.facebook.com/flyimmigration.vn"
              className={s.footer__socialLink}
              style={{ backgroundColor: "#1877F2" }}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook URL"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#"
              className={s.footer__socialLink}
              style={{ backgroundColor: "#FF0000" }}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube URL"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@flyvisa.immigration?_r=1&_t=ZS-952PBR111k5"
              className={s.footer__socialLink}
              style={{ backgroundColor: "#000000" }}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok URL"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className={s.footer__sectionTitle}>{f.jobs}</h4>
          <ul className={s.footer__linkList}>
            {(f.jobLinks as string[]).map((item: string) => (
              <li key={item}>
                <Link to="/jobs" className={s.footer__link}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={s.footer__sectionTitle}>{f.support}</h4>
          <ul className={s.footer__linkList}>
            {[
              { to: "/about", label: f.supportLinks[0] },
              { to: "/process", label: f.supportLinks[1] },
              { to: "/faq", label: f.supportLinks[2] },
              { to: "/news", label: f.supportLinks[3] },
              { to: "/contact", label: f.supportLinks[4] },
              { to: "/tos", label: f.supportLinks[5] },
              { to: "/privacy", label: f.supportLinks[6] },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={s.footer__link}>
                  {label}
                </Link>
              </li>
            ))}
            {!loadingPolicies &&
              policies.map((p) => (
                <li key={p.slug}>
                  <Link to={`/policy/${p.slug}`} className={s.footer__link}>
                    {p.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className={s.footer__sectionTitle}>{f.contact}</h4>
          <ul className={s.footer__linkList}>
            <li className={s.footer__contactRow}>
              <MapPin size={15} className={s.footer__contactIcon} />
              <span>{address}</span>
            </li>
            <li className={s.footer__contactRow}>
              <Phone size={15} className={s.footer__contactIcon} />
              <span className={s.footer__preLine}>{phone}</span>
            </li>
            <li className={s.footer__contactRow}>
              <Mail size={15} className={s.footer__contactIcon} />
              <a href={`mailto:${email}`} className={s.footer__mailLink}>
                {email}
              </a>
            </li>
          </ul>
          <div className={s.footer__hoursBox}>
            <p>{officeHours}</p>
            <p>{hoursText}</p>
          </div>
        </div>
      </div>

      <div className={s.footer__bottom}>
        <div className={`${s.footer__bottomInner} fl-max-7xl`}>
          <div className={s.footer__bctRow}>
            <Link to="/">
              <img
                src="/logo.png"
                alt="Fly Immigration"
                className={s.footer__bctLogoSmall}
              />
            </Link>
            <span className={s.footer__divider} />
            <div className={s.footer__bctContent}>
              <a
                href="http://online.gov.vn/Home/WebDetails/140726"
                target="_blank"
                rel="noreferrer"
                className={s.footer__bctLink}
              >
                <img
                  src="/logo-bct.png"
                  alt="Đã thông báo Bộ Công Thương"
                  className={s.footer__bctSealImg}
                />
              </a>
              <div>
                <p className={s.footer__bctLegalLabel}>Giấy phép kinh doanh</p>
                <div className={s.footer__bctLegalBody}>{bct}</div>
              </div>
            </div>
          </div>
          <div className={s.footer__copyrightRow}>
            <p>{copyright}</p>
            {!loadingPolicies && policies.length > 0 && (
              <div className={s.footer__policyLinks}>
                {policies.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/policy/${p.slug}`}
                    className={s.footer__policyLink}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
