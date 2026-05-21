import Flag from "react-world-flags";

const COUNTRY_ISO_MAP: Record<string, string> = {
  australia: "AU",
  canada: "CA",
  new_zealand: "NZ",
  norway: "NO",
  germany: "DE",
  portugal: "PT",
  czech: "CZ",
  us: "US",
  uk: "GB",
  japan: "JP",
  singapore: "SG",
  south_korea: "KR",
  taiwan: "TW",
  uae: "AE",
  vietnam: "VN",
  vn: "VN",
  vi: "VN",
  en: "US",
};

interface CountryFlagProps {
  country: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountryFlag({ country, className, style }: CountryFlagProps) {
  const code = COUNTRY_ISO_MAP[country.toLowerCase()] || country.toUpperCase();
  return (
    <Flag
      code={code}
      className={className}
      style={{
        width: "1.25rem",
        height: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "2px",
        objectFit: "cover",
        ...style,
      }}
    />
  );
}
