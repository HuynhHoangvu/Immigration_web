import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Search, CheckCircle, Plane, Briefcase, HeadphonesIcon } from 'lucide-react'

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Tìm kiếm việc làm',
    desc: 'Duyệt qua danh sách hàng trăm cơ hội việc làm tại Úc, Canada, New Zealand và nhiều quốc gia khác. Lọc theo quốc gia, ngành nghề, mức lương phù hợp với nhu cầu của bạn.',
    note: 'Miễn phí, không cần đăng ký',
  },
  {
    num: '02',
    icon: FileText,
    title: 'Nộp hồ sơ ứng tuyển',
    desc: 'Điền đầy đủ thông tin cá nhân, kinh nghiệm làm việc và upload CV của bạn. Đội ngũ tư vấn sẽ hỗ trợ bạn hoàn thiện hồ sơ đạt chuẩn quốc tế.',
    note: 'Hỗ trợ dịch thuật công chứng',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Xét duyệt & phỏng vấn',
    desc: 'Hồ sơ được chuyển đến nhà tuyển dụng xem xét. Nếu phù hợp, bạn sẽ được mời phỏng vấn trực tiếp hoặc online với nhà tuyển dụng nước ngoài.',
    note: 'Thời gian: 7–14 ngày làm việc',
  },
  {
    num: '04',
    icon: FileText,
    title: 'Làm visa & giấy tờ',
    desc: 'Sau khi được chấp nhận, đội ngũ pháp lý của Fly Labour hỗ trợ toàn bộ quy trình xin visa lao động, hợp đồng lao động, và các giấy tờ cần thiết.',
    note: 'Hỗ trợ toàn bộ thủ tục',
  },
  {
    num: '05',
    icon: Plane,
    title: 'Xuất cảnh & định hướng',
    desc: 'Chúng tôi hỗ trợ đặt vé máy bay, cung cấp tài liệu định hướng nhập cảnh, và kết nối bạn với cộng đồng người Việt tại nước đến.',
    note: 'Hỗ trợ 24/7 trước ngày bay',
  },
  {
    num: '06',
    icon: Briefcase,
    title: 'Bắt đầu làm việc',
    desc: 'Bạn bắt đầu công việc tại nước ngoài. Fly Labour tiếp tục đồng hành, hỗ trợ giải quyết các vấn đề phát sinh trong suốt thời gian làm việc.',
    note: 'Đồng hành suốt hợp đồng',
  },
]

const DOCS = [
  'CMND/CCCD còn hiệu lực',
  'Hộ chiếu (passport) còn hạn ít nhất 2 năm',
  'Hộ khẩu/Giấy xác nhận thường trú',
  'Bằng cấp, chứng chỉ nghề (nếu có)',
  'Giấy khám sức khỏe (theo yêu cầu quốc gia)',
  'Ảnh 3x4 nền trắng (6 ảnh)',
  'CV tiếng Anh (đội ngũ hỗ trợ soạn thảo)',
  'Chứng chỉ tiếng Anh IELTS/TOEIC (nếu có)',
]

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-brand-dark to-brand-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-4">Quy trình</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Quy trình đăng ký<br />
            <span style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              đơn giản & minh bạch
            </span>
          </h1>
          <p className="text-brand-muted text-lg leading-relaxed">
            Từ khi nộp hồ sơ đến khi xuất cảnh, chúng tôi đồng hành cùng bạn ở mọi bước.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="bg-brand-card border border-brand-border rounded-2xl p-6 flex gap-5 hover:border-brand-gold/30 transition-colors">
                {/* Number + line */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-900 text-sm"
                    style={{ background: 'linear-gradient(135deg,#e4a808,#fdd52f)' }}>
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 h-8 bg-brand-border" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                      <p className="text-brand-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                    <span className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-medium whitespace-nowrap">
                      {step.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-20 px-6 bg-brand-card/20 border-y border-brand-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3">Hồ sơ</p>
            <h2 className="text-3xl font-bold text-white">Giấy tờ cần chuẩn bị</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DOCS.map(doc => (
              <div key={doc} className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-xl p-3.5">
                <CheckCircle size={15} className="text-brand-gold shrink-0" />
                <span className="text-brand-muted text-sm">{doc}</span>
              </div>
            ))}
          </div>
          <p className="text-brand-muted text-xs text-center mt-5">
            * Danh sách có thể thay đổi tùy theo yêu cầu của từng quốc gia và nhà tuyển dụng.
          </p>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <HeadphonesIcon size={36} className="text-brand-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Cần hỗ trợ thêm?</h2>
          <p className="text-brand-muted mb-8">Đội ngũ tư vấn của chúng tôi sẵn sàng giải đáp mọi thắc mắc từ Thứ 2 đến Thứ 7, 8:00 – 18:00.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary flex items-center gap-2 px-6 py-3">
              Liên hệ tư vấn <ArrowRight size={16} />
            </Link>
            <Link to="/jobs" className="px-6 py-3 rounded-xl border border-brand-border text-brand-muted hover:text-white hover:border-white/20 transition-colors text-sm">
              Xem việc làm
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
