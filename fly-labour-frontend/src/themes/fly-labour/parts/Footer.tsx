import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useT } from "@/core/hooks/useT";
import { EditableText } from "@/admin/components/EditableText";
import { EditableLink } from "@/admin/components/EditableLink";
import { usePageContent } from "@/core/hooks/usePageContent";
import { useState, useEffect } from "react";
import { settingsApi } from "@/core/services/api";

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
    "219A, No Trang Long, Binh Thanh, Ho Chi Minh City",
  );
  const phone = usePageContent("footer.phone", "0333 318 882");
  const email = usePageContent("footer.email", "flyvisa@gmail.com");
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
    <footer className="bg-white dark:bg-[#0a0d14] border-t border-slate-200 dark:border-white/5 mt-20 transition-colors duration-300">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <img
              src="/logo.png"
              alt="Fly Immigration"
              className="h-14 w-auto object-contain"
            />
          </div>
          <p className="text-slate-500 dark:text-brand-muted text-sm leading-relaxed transition-colors">
            {f.tagline}
          </p>
          <div className="flex gap-3 mt-5">
            <EditableLink
              settingKey="social.facebook"
              defaultValue="https://www.facebook.com/flyimmigration.vn"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#1877F2" }}
              target="_blank"
              rel="noreferrer"
              label="Facebook URL"
            >
              {/* Facebook */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </EditableLink>
            <EditableLink
              settingKey="social.youtube"
              defaultValue="#"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#FF0000" }}
              target="_blank"
              rel="noreferrer"
              label="YouTube URL"
            >
              {/* YouTube */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </svg>
            </EditableLink>
            <EditableLink
              settingKey="social.tiktok"
              defaultValue="https://www.tiktok.com/@flyvisa.immigration?_r=1&_t=ZS-952PBR111k5"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90 shadow-sm"
              style={{ backgroundColor: "#000000" }}
              target="_blank"
              rel="noreferrer"
              label="TikTok URL"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </EditableLink>
          </div>
        </div>

        {/* Jobs Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-brand-gold transition-colors">
            {f.jobs}
          </h4>
          <ul className="space-y-2">
            {(f.jobLinks as string[]).map((item: string) => (
              <li key={item}>
                <Link
                  to="/jobs"
                  className="text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-brand-gold transition-colors">
            {f.support}
          </h4>
          <ul className="space-y-2">
            {[
              { to: "/about", label: f.supportLinks[0] },
              { to: "/process", label: f.supportLinks[1] },
              { to: "/faq", label: f.supportLinks[2] },
              { to: "/news", label: f.supportLinks[3] },
              { to: "/contact", label: f.supportLinks[4] },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold text-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            {/* Dynamic Policy Links — quản lý qua Admin > Chính sách */}
            {!loadingPolicies &&
              policies.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/policy/${p.slug}`}
                    className="text-slate-500 dark:text-brand-muted hover:text-amber-600 dark:hover:text-brand-gold text-sm transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-brand-gold transition-colors">
            {f.contact}
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-slate-500 dark:text-brand-muted transition-colors">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-amber-500 dark:text-brand-gold"
              />
              <EditableText
                settingKey="footer.address"
                defaultValue={address}
              />
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-brand-muted transition-colors">
              <Phone
                size={15}
                className="text-amber-500 dark:text-brand-gold"
              />
              <EditableText settingKey="footer.phone" defaultValue={phone} />
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-500 dark:text-brand-muted transition-colors">
              <Mail size={15} className="text-amber-500 dark:text-brand-gold" />
              <EditableText settingKey="footer.email" defaultValue={email} />
            </li>
          </ul>
          <div className="mt-5 p-4 bg-amber-50 dark:bg-brand-gold/5 border border-amber-200 dark:border-brand-gold/10 rounded-xl transition-colors">
            <p className="text-xs text-amber-700 dark:text-brand-gold font-semibold transition-colors">
              <EditableText
                settingKey="footer.officeHours"
                defaultValue={officeHours}
              />
            </p>
            <p className="text-xs text-slate-600 dark:text-brand-muted mt-1.5 whitespace-pre-line transition-colors">
              <EditableText
                settingKey="footer.hoursText"
                defaultValue={hoursText}
                multiline
              />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-200 dark:border-white/5 py-6 px-6 transition-colors">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* BCT registration & Logo */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 border-b border-slate-200 dark:border-white/5 pb-6">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Fly Immigration"
                className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </Link>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block" />
            <div className="flex items-center gap-4">
              <a 
                href="http://online.gov.vn/Home/WebDetails/140726" 
                target="_blank" 
                rel="noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/logo-bct.png"
                  alt="Đã thông báo Bộ Công Thương"
                  className="h-10 w-auto object-contain"
                />
              </a>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-brand-muted mb-0.5">
                  Giấy phép kinh doanh
                </p>
                <div className="text-xs text-slate-500 dark:text-brand-muted font-medium">
                  <EditableText settingKey="footer.bct" defaultValue={bct} />
                </div>
              </div>
            </div>
          </div>
          {/* Copyright + Policy links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-brand-muted transition-colors">
            <p>
              <EditableText
                settingKey="footer.copyright"
                defaultValue={copyright}
              />
            </p>
            {/* Dynamic bottom policy links */}
            {!loadingPolicies && policies.length > 0 && (
              <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
                {policies.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/policy/${p.slug}`}
                    className="hover:text-amber-600 dark:hover:text-brand-gold transition-colors font-medium"
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
