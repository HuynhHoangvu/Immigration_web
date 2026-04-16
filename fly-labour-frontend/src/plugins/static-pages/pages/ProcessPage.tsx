import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Search,
  CheckCircle,
  Plane,
  Briefcase,
  HeadphonesIcon,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Search,
    title: "Tìm kiếm việc làm",
    desc: "Duyệt qua danh sách hàng trăm cơ hội việc làm tại Úc, Canada, New Zealand và nhiều quốc gia khác. Lọc theo quốc gia, ngành nghề, mức lương phù hợp với nhu cầu của bạn.",
    note: "Miễn phí, không cần đăng ký",
  },
  {
    num: "02",
    icon: FileText,
    title: "Nộp hồ sơ ứng tuyển",
    desc: "Điền đầy đủ thông tin cá nhân, kinh nghiệm làm việc và upload CV của bạn. Đội ngũ tư vấn sẽ hỗ trợ bạn hoàn thiện hồ sơ đạt chuẩn quốc tế.",
    note: "Hỗ trợ dịch thuật công chứng",
  },
  {
    num: "03",
    icon: CheckCircle,
    title: "Xét duyệt & phỏng vấn",
    desc: "Hồ sơ được chuyển đến nhà tuyển dụng xem xét. Nếu phù hợp, bạn sẽ được mời phỏng vấn trực tiếp hoặc online với nhà tuyển dụng nước ngoài.",
    note: "Thời gian: 7–14 ngày làm việc",
  },
  {
    num: "04",
    icon: FileText,
    title: "Làm visa & giấy tờ",
    desc: "Sau khi được chấp nhận, đội ngũ pháp lý của Fly Labour hỗ trợ toàn bộ quy trình xin visa lao động, hợp đồng lao động, và các giấy tờ cần thiết.",
    note: "Hỗ trợ toàn bộ thủ tục",
  },
  {
    num: "05",
    icon: Plane,
    title: "Xuất cảnh & định hướng",
    desc: "Chúng tôi hỗ trợ đặt vé máy bay, cung cấp tài liệu định hướng nhập cảnh, và kết nối bạn với cộng đồng người Việt tại nước đến.",
    note: "Hỗ trợ 24/7 trước ngày bay",
  },
  {
    num: "06",
    icon: Briefcase,
    title: "Bắt đầu làm việc",
    desc: "Bạn bắt đầu công việc tại nước ngoài. Fly Labour tiếp tục đồng hành, hỗ trợ giải quyết các vấn đề phát sinh trong suốt thời gian làm việc.",
    note: "Đồng hành suốt hợp đồng",
  },
];

const DOCS = [
  "CMND/CCCD còn hiệu lực",
  "Hộ chiếu (passport) còn hạn ít nhất 2 năm",
  "Hộ khẩu/Giấy xác nhận thường trú",
  "Bằng cấp, chứng chỉ nghề (nếu có)",
  "Giấy khám sức khỏe (theo yêu cầu quốc gia)",
  "Ảnh 3x4 nền trắng (6 ảnh)",
  "CV tiếng Anh (đội ngũ hỗ trợ soạn thảo)",
  "Chứng chỉ tiếng Anh IELTS/TOEIC (nếu có)",
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-amber-100/30 dark:from-[#1a0f00] dark:via-brand-dark dark:to-brand-dark transition-colors duration-500" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 dark:opacity-10 pointer-events-none"
          style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">
            Quy trình
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            Quy trình đăng ký
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#e4a808,#fdd52f)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              đơn giản & minh bạch
            </span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
            Từ khi nộp hồ sơ đến khi xuất cảnh, chúng tôi đồng hành cùng bạn ở mọi bước.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-2xl p-6 flex gap-5 hover:border-amber-400 dark:hover:border-brand-gold/30 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-amber-900 text-sm shadow-md"
                    style={{ background: "linear-gradient(135deg,#e4a808,#fdd52f)" }}
                  >
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 h-8 bg-slate-200 dark:bg-brand-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-semibold text-base mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 dark:bg-brand-gold/10 dark:border-brand-gold/20 dark:text-brand-gold font-medium whitespace-nowrap">
                      {step.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="py-20 px-6 bg-slate-100/50 dark:bg-brand-card/20 border-y border-slate-200 dark:border-brand-border transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 dark:text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">
              Hồ sơ
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Giấy tờ cần chuẩn bị
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DOCS.map((doc) => (
              <div
                key={doc}
                className="flex items-center gap-3 bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border shadow-sm dark:shadow-none rounded-xl p-4 transition-colors"
              >
                <CheckCircle size={16} className="text-amber-500 dark:text-brand-gold shrink-0" />
                <span className="text-slate-700 dark:text-gray-300 text-sm font-medium">{doc}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 dark:text-gray-300 text-xs text-center mt-6 font-medium">
            * Danh sách có thể thay đổi tùy theo yêu cầu của từng quốc gia và nhà tuyển dụng.
          </p>
        </div>
      </div>

      {/* Support CTA */}
      <div className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <HeadphonesIcon size={36} className="text-amber-500 dark:text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Cần hỗ trợ thêm?
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8">
            Đội ngũ tư vấn của chúng tôi sẵn sàng giải đáp mọi thắc mắc từ Thứ 2 đến Thứ 7, 8:00 – 18:00.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary flex items-center gap-2 px-6 py-3 font-medium">
              Liên hệ tư vấn <ArrowRight size={16} />
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-brand-border text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Xem việc làm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
