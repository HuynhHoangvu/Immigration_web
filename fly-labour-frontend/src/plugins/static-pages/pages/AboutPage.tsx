import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const STATS = [
  { value: "5,000+", label: "Lao động đã xuất cảnh" },
  { value: "200+", label: "Đối tác tuyển dụng" },
  { value: "15+", label: "Quốc gia hợp tác" },
  { value: "10+", label: "Năm kinh nghiệm" },
];

const SERVICES = [
  {
    icon: Globe,
    title: "Xuất khẩu lao động",
    desc: "Kết nối người lao động Việt Nam với các nhà tuyển dụng uy tín tại Úc, Canada, New Zealand và nhiều quốc gia khác.",
  },
  {
    icon: Briefcase,
    title: "Tư vấn hồ sơ",
    desc: "Đội ngũ chuyên gia hỗ trợ chuẩn bị hồ sơ, dịch thuật công chứng, và hướng dẫn quy trình visa đầy đủ.",
  },
  {
    icon: Users,
    title: "Đào tạo ngôn ngữ",
    desc: "Chương trình luyện thi IELTS, học tiếng Anh giao tiếp và nghiệp vụ dành riêng cho người lao động.",
  },
  {
    icon: Award,
    title: "Hỗ trợ sau xuất cảnh",
    desc: "Đồng hành cùng người lao động trong suốt quá trình làm việc ở nước ngoài — từ thích nghi đến gia hạn hợp đồng.",
  },
];

const WHYS = [
  "Giấy phép hoạt động đầy đủ, được Bộ LĐTBXH cấp phép",
  "Hơn 10 năm kinh nghiệm trong ngành xuất khẩu lao động",
  "Mạng lưới đối tác tuyển dụng uy tín tại Úc, Canada, NZ",
  "Không thu phí môi giới trái phép, minh bạch 100%",
  "Hỗ trợ 24/7 trong suốt quá trình làm việc ở nước ngoài",
  "Tỷ lệ người lao động hoàn thành hợp đồng đạt 97%",
];

const TEAM = [
  { name: "Nguyễn Văn An", role: "Giám đốc điều hành", initial: "A" },
  { name: "Trần Thị Bình", role: "Trưởng phòng Tư vấn", initial: "B" },
  { name: "Lê Minh Cường", role: "Chuyên viên Pháp lý", initial: "C" },
  { name: "Phạm Thu Dung", role: "Trưởng phòng Đào tạo", initial: "D" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-600 dark:text-brand-gold text-sm font-bold tracking-widest uppercase mb-4">
            Về chúng tôi
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Cầu nối lao động Việt Nam
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              với thế giới
            </span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Fly Labour là đơn vị tiên phong trong lĩnh vực xuất khẩu lao động tại Việt Nam, kết nối hàng nghìn người lao động với cơ hội việc làm chất lượng cao ở nước ngoài.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link to="/jobs" className="btn-primary flex items-center gap-2 px-6 py-3">
              Xem việc làm <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-14 px-6 border-y border-slate-200 dark:border-brand-border bg-white/60 dark:bg-brand-card/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </p>
              <p className="text-slate-600 dark:text-gray-300 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              Sứ mệnh
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-5">
              Mang lại cơ hội việc làm tốt nhất cho người Việt
            </h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-4">
              Chúng tôi tin rằng mọi người lao động Việt Nam đều xứng đáng có cơ hội làm việc trong môi trường chuyên nghiệp, được trả lương xứng đáng và đảm bảo quyền lợi đầy đủ.
            </p>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
              Fly Labour cam kết hoạt động minh bạch, hợp pháp và luôn đặt lợi ích của người lao động lên hàng đầu trong mọi quyết định.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Úc (Australia)", flag: "🇦🇺", jobs: "1,200+ việc làm" },
              { label: "Canada", flag: "🇨🇦", jobs: "800+ việc làm" },
              { label: "New Zealand", flag: "🇳🇿", jobs: "600+ việc làm" },
              { label: "Và nhiều hơn", flag: "🌏", jobs: "12+ quốc gia khác" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-4 text-center shadow-sm dark:shadow-none transition-colors"
              >
                <p className="text-3xl mb-2">{c.flag}</p>
                <p className="text-slate-900 dark:text-white text-sm font-semibold">{c.label}</p>
                <p className="text-amber-600 dark:text-brand-gold text-xs font-medium mt-1">{c.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-20 px-6 bg-slate-100/50 dark:bg-brand-card/20 transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              Dịch vụ
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Chúng tôi cung cấp gì?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-2xl p-5 hover:border-amber-400 dark:hover:border-brand-gold/30 shadow-sm dark:shadow-none transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md"
                  style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                >
                  <s.icon size={18} className="text-slate-900" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2 text-sm">{s.title}</h3>
                <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why us */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              Lý do chọn chúng tôi
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Tại sao nên chọn Fly Labour?
            </h2>
            <ul className="space-y-3">
              {WHYS.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-amber-500 dark:text-brand-gold shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-gray-300 text-sm font-medium">{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-8 transition-colors">
            <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-6">Đội ngũ lãnh đạo</h3>
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-900 font-bold shrink-0 shadow-sm"
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {m.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{m.name}</p>
                    <p className="text-slate-500 dark:text-gray-300 text-xs font-medium truncate">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="py-16 px-6 bg-slate-100/50 dark:bg-brand-card/20 border-t border-slate-200 dark:border-brand-border transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: Phone, label: "Hotline", value: "0901 234 567" },
              { icon: Mail, label: "Email", value: "info@flylabour.com" },
              { icon: MapPin, label: "Địa chỉ", value: "123 Nguyễn Văn Linh, Q.7, TP.HCM" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-5 transition-colors"
              >
                <c.icon size={20} className="text-amber-500 dark:text-brand-gold mx-auto mb-3" />
                <p className="text-slate-500 dark:text-gray-300 text-xs font-medium mb-1">{c.label}</p>
                <p className="text-slate-900 dark:text-white text-sm font-semibold">{c.value}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Gửi liên hệ ngay <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
