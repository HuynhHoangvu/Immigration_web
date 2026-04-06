import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useT } from "@/hooks/useT";
import { EditableText } from "@/components/ui/EditableText";
import { EditableLink } from "@/components/ui/EditableLink";
import { usePageContent } from "@/hooks/usePageContent";
import { useState, useEffect } from "react";
import { settingsApi } from "@/services/api";

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
    <footer className="bg-gray-100 dark:bg-[#1a1a19] border-t border-gray-200 dark:border-[#3a3a38] mt-20 transition-colors duration-300">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              <span className="text-amber-900 font-display text-base font-black">
                FL
              </span>
            </div>
            <span className="font-display text-xl font-black tracking-wider text-gray-900 dark:text-white">
              FLY <span style={{ color: "#e4a808" }}>LABOUR</span>
            </span>
          </div>
          <p className="text-gray-500 dark:text-[#7a7a78] text-sm leading-relaxed">
            {f.tagline}
          </p>
          <div className="flex gap-3 mt-5">
            <EditableLink
              settingKey="social.facebook"
              defaultValue="https://www.facebook.com/flyimmigration.vn"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90"
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
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90"
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
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90"
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
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-[#fdd52f]">
            {f.jobs}
          </h4>
          <ul className="space-y-2">
            {(f.jobLinks as string[]).map((item: string) => (
              <li key={item}>
                <Link
                  to="/jobs"
                  className="text-gray-500 dark:text-[#7a7a78] hover:text-amber-600 dark:hover:text-white text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-[#fdd52f]">
            {f.support}
          </h4>
          <ul className="space-y-2">
            {[
              { to: "/about", label: f.supportLinks[0] },
              { to: "/process", label: f.supportLinks[1] },
              { to: "/faq", label: f.supportLinks[2] },
              { to: "/news", label: f.supportLinks[3] },
              { to: "/contact", label: f.supportLinks[4] },
              { to: "/privacy", label: f.supportLinks[5] },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-gray-500 dark:text-[#7a7a78] hover:text-amber-600 dark:hover:text-white text-sm transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
            {/* 🔥 Dynamic Policy Links */}
            {!loadingPolicies && policies.length > 0 && (
              <>
                {policies.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/policy/${p.slug}`}
                      className="text-gray-500 dark:text-[#7a7a78] hover:text-amber-600 dark:hover:text-white text-sm transition-colors"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-amber-600 dark:text-[#fdd52f]">
            {f.contact}
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-500 dark:text-[#7a7a78]">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0 text-amber-500 dark:text-[#fdd52f]"
              />
              <EditableText
                settingKey="footer.address"
                defaultValue={address}
              />
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#7a7a78]">
              <Phone size={15} className="text-amber-500 dark:text-[#fdd52f]" />
              <EditableText settingKey="footer.phone" defaultValue={phone} />
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#7a7a78]">
              <Mail size={15} className="text-amber-500 dark:text-[#fdd52f]" />
              <EditableText settingKey="footer.email" defaultValue={email} />
            </li>
          </ul>
          <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
              <EditableText
                settingKey="footer.officeHours"
                defaultValue={officeHours}
              />
            </p>
            <p className="text-xs text-gray-500 dark:text-[#7a7a78] mt-1 whitespace-pre-line">
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
      <div className="border-t border-gray-200 dark:border-[#3a3a38] py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400 dark:text-[#7a7a78]">
          <p>
            <EditableText
              settingKey="footer.copyright"
              defaultValue={copyright}
            />
          </p>
          <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
            <Link
              to="/privacy"
              className="hover:text-amber-600 dark:hover:text-white transition-colors"
            >
              {f.privacy}
            </Link>
            <Link
              to="/policy/terms-of-service"
              className="hover:text-amber-600 dark:hover:text-white transition-colors"
            >
              {f.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
