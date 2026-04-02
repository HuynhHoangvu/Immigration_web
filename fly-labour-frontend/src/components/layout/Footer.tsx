import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube } from "lucide-react";
import { useT } from "@/hooks/useT";

export default function Footer() {
  const { t } = useT();
  const f = t("footer");

  return (
    <footer className="bg-brand-card border-t border-brand-border mt-20">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
            >
              <span className="text-slate-900 font-display text-base font-black">
                FL
              </span>
            </div>
            <span className="font-display text-xl text-white tracking-wider">
              <span style={{ color: "#fdd52f" }}> FLY LABOUR</span>
            </span>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed">
            {f.tagline}
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: "#1877F2" }}
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: "#FF0000" }}
            >
              <Youtube size={16} />
            </a>
            <a
              href="https://www.tiktok.com/@flylabour"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: "#000000" }}
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

        {/* Jobs Links */}
        <div>
          <h4
            className="font-semibold text-white mb-4 text-sm uppercase tracking-widest"
            style={{ color: "#fdd52f" }}
          >
            {f.jobs}
          </h4>
          <ul className="space-y-2">
            {(f.jobLinks as string[]).map((item: string) => (
              <li key={item}>
                <Link
                  to="/jobs"
                  className="text-brand-muted hover:text-white text-sm transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4
            className="font-semibold text-white mb-4 text-sm uppercase tracking-widest"
            style={{ color: "#fdd52f" }}
          >
            {f.support}
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[0]}
              </Link>
            </li>
            <li>
              <Link
                to="/process"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[1]}
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[2]}
              </Link>
            </li>
            <li>
              <Link
                to="/news"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[3]}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[4]}
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-brand-muted hover:text-white text-sm transition-colors"
              >
                {f.supportLinks[5]}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            className="font-semibold text-white mb-4 text-sm uppercase tracking-widest"
            style={{ color: "#fdd52f" }}
          >
            {f.contact}
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-brand-muted">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: "#fdd52f" }}
              />
              <span>219A, No Trang Long, Binh Thanh, Ho Chi Minh City</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Phone size={15} style={{ color: "#fdd52f" }} />
              <a
                href="tel:0901234567"
                className="hover:text-white transition-colors"
              >
                0333318882
              </a>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Mail size={15} style={{ color: "#fdd52f" }} />
              <a
                href="mailto:flyvisa@gmail.com"
                className="hover:text-white transition-colors"
              >
                flyvisa@gmail.com
              </a>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-brand-gold/5 border border-brand-gold/20 rounded-xl">
            <p className="text-xs text-brand-gold font-semibold">
              {f.officeHours}
            </p>
            <p className="text-xs text-brand-muted mt-1 whitespace-pre-line">
              {f.hoursText}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-brand-border py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-brand-muted">
          <p>{f.copyright}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {f.privacy}
            </Link>
            <Link to="/faq" className="hover:text-white transition-colors">
              {f.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
